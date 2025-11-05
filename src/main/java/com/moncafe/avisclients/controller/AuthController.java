package com.moncafe.avisclients.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Map<String, Object> response = new HashMap<>();

        if ("admin".equals(username) && "admin".equals(password)) {
            response.put("success", true);
            response.put("token", "123456"); // Je peut générer un token plus sécurisé ici
        } else {
            response.put("success", false);
            response.put("message", "Identifiants incorrects");
        }

        return ResponseEntity.ok(response);
    }
}
