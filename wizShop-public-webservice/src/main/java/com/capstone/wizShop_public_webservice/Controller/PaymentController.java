package com.capstone.wizShop_public_webservice.Controller;

import com.capstone.wizShop_public_webservice.DTO.CartItem;
import com.capstone.wizShop_public_webservice.DTO.PaymentRequest;
import com.capstone.wizShop_public_webservice.Properties.Properties;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PaymentController {

    @Autowired
    private Properties properties;

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest paymentRequest) {
        logger.info("test");
        Stripe.apiKey = properties.getStripeSecretKey(); 

        List<CartItem> cart = paymentRequest.getCart();
        String token = paymentRequest.getToken();

        try {
            // Create a charge with Stripe
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", calculateTotalAmount(cart)); // amount in cents
            chargeParams.put("currency", "sgd");
            chargeParams.put("description", "Purchase from wizShop");
            chargeParams.put("source", token);

            Charge charge = Charge.create(chargeParams);

            // Payment succeeded
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
