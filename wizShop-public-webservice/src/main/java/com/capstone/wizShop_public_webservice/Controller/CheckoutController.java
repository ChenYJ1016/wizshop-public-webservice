package com.capstone.wizShop_public_webservice.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CheckoutController {

    @GetMapping("/checkout")
    public String showCheckoutPage() {
        return "checkout";  
    }
}
