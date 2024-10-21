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
        String csrfToken = getCsrfToken(); 

        List<CartItem> cartItems = paymentRequest.getCart();
        DeliveryInfo delInfo = paymentRequest.getDeliveryInfo();
        logger.info("processPayment(): delivery - {} {} {} {} {} {} ", delInfo.getAddress(), delInfo.getCity(), delInfo.getName(), delInfo.getName(), delInfo.getPhone(), delInfo.getZip());
        for (CartItem item : cartItems) {
        	logger.info("processPayment(): {} {}", item.getProductId(), item.getProductName());
        }
        Stripe.apiKey = properties.getStripeSecretKey(); 

        List<CartItem> cart = paymentRequest.getCart();
        String token = paymentRequest.getToken();

        try {
            // Create a charge with Stripe
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", calculateTotalAmount(cart)); 
            chargeParams.put("currency", "sgd");
            chargeParams.put("description", "Purchase from wizShop (Test)");
            chargeParams.put("source", token);

            Charge charge = Charge.create(chargeParams);
            
            HttpHeaders headers = new HttpHeaders();

            headers.set("X-XSRF-TOKEN", csrfToken);
                       
            HttpEntity<PaymentRequest> request = new HttpEntity<>(paymentRequest, headers);
            String url = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/orders/create").toUriString();
            restTemplate.exchange(url, HttpMethod.POST, request, Void.class);
            return ResponseEntity.ok(Collections.singletonMap("success", true));

        } catch (StripeException e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", e.getMessage()));

        } catch (Exception ex) {
            // Log any other exception that may occur
            logger.error("General error: " + ex.getMessage(), ex);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", ex.getMessage()));

        }
    }

    // Calculate total amount in cents based on the cart items
    private int calculateTotalAmount(List<CartItem> cart) {
        int total = 0;
        for (CartItem item : cart) {
            total += item.getQuantity() * 1000; // Example: 1000 cents = $10 per item
        }
        return total;
    }
}
