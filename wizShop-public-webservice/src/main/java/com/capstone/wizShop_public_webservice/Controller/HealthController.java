package com.capstone.wizShop_public_webservice.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<String> healthCheck() {
        // Respond with a 200 OK status and a simple message
        return ResponseEntity.status(HttpStatus.OK).body("Application is healthy");
    }
}