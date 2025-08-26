package com.moncafe.avisclients.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HomeController {

    // This controller can be used to handle requests to the home page
    // Add methods to handle specific routes as needed
    // Example: @GetMapping("/") can be added to return a welcome message
    // You can also inject services to handle business logic
    // Example method:
    @GetMapping("/")
    public String home() {
        return "Welcome to Mon Café Avis !";
    }

}
