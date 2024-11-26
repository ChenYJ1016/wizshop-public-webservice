package com.capstone.wizShop_public_webservice.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/shop")
public class CheckoutController {

    @GetMapping("/checkout")
    public String showCheckoutPage() {
        return "checkout";  
    }
}
