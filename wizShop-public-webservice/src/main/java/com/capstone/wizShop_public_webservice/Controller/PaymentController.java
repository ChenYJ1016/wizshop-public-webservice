package com.capstone.wizShop_public_webservice.Controller;

import com.capstone.wizShop_public_webservice.DTO.CartItem;
import com.capstone.wizShop_public_webservice.DTO.DeliveryInfo;
import com.capstone.wizShop_public_webservice.DTO.PaymentRequest;
import com.capstone.wizShop_public_webservice.Properties.Properties;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PaymentController {

    @Autowired
    private Properties properties;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private HttpServletRequest request;

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private String getCsrfToken() {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        return csrfToken != null ? csrfToken.getToken() : null;
    }

    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest paymentRequest) {
        logger.info("Processing payment");

        // Retrieve CSRF token safely
        String csrfToken = getCsrfToken();

        // Validate payment request
        List<CartItem> cartItems = paymentRequest.getCart();
        DeliveryInfo delInfo = paymentRequest.getDeliveryInfo();
        
        if (cartItems == null || cartItems.isEmpty()) {
            logger.error("Empty cart items received");
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Cart cannot be empty"));
        }
        
        if (delInfo == null || delInfo.getAddress() == null || delInfo.getAddress().trim().isEmpty()) {
            logger.error("Delivery information is incomplete");
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Delivery information is required"));
        }

        Stripe.apiKey = properties.getStripeSecretKey();

        String token = paymentRequest.getToken();
        try {
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", calculateTotalAmount(cartItems)); 
            chargeParams.put("currency", "sgd");
            chargeParams.put("description", "Purchase from wizShop");
            chargeParams.put("source", HtmlUtils.htmlEscape(token));

            Charge charge = Charge.create(chargeParams);

            if (!"succeeded".equals(charge.getStatus())) {
                logger.error("Payment failed: {}", charge.getFailureMessage());
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                        .body(Collections.singletonMap("message", "Payment failed: " + charge.getFailureMessage()));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-XSRF-TOKEN", csrfToken);
            HttpEntity<PaymentRequest> requestEntity = new HttpEntity<>(paymentRequest, headers);

            String url = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/orders/create").toUriString();
            restTemplate.exchange(url, HttpMethod.POST, requestEntity, Void.class);

            return ResponseEntity.ok(Collections.singletonMap("success", true));

        } catch (StripeException e) {
            logger.error("Stripe error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", e.getMessage()));

        } catch (Exception ex) {
            logger.error("General error: {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        }
    }


    private int calculateTotalAmount(List<CartItem> cart) {
        int total = 0;
        for (CartItem item : cart) {
            total += item.getQuantity() * item.getProductPrice() * 100; // Convert to cents
        }
        
        return total;
    }

}
