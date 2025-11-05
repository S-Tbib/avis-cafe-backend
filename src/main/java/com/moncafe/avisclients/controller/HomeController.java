package com.moncafe.avisclients.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    // This controller can be used to handle requests to the home page
    // Add methods to handle specific routes as needed
    // Example: @GetMapping("/") can be added to return a welcome message
    // You can also inject services to handle business logic
    // Example method:
    // Ceci est seulement un exemple simple pour faire un petit test
    @GetMapping("/")
    public String home() {
        return "Welcome to Mon Café Avis !";
    }

}
