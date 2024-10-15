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
	
    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);


    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest paymentRequest) {
    	
        Stripe.apiKey = properties.getStripSecretKey(); 

        List<CartItem> cart = paymentRequest.getCart();
        String token = paymentRequest.getToken();

        try {
            // Create a charge with Stripe
            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", calculateTotalAmount(cart)); // amount in cents
            chargeParams.put("currency", "usd");
            chargeParams.put("description", "Purchase from wizShop");
            chargeParams.put("source", token);

            Charge charge = Charge.create(chargeParams);

            // Payment succeeded
            return ResponseEntity.ok(Collections.singletonMap("success", true));

        } catch (StripeException e) {
        	logger.error(e.getMessage());
            // Payment failed
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("success", false));
           
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
