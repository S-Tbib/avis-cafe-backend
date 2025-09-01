package com.moncafe.avisclients.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

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
            response.put("token", "123456"); // ici tu pourrais générer un vrai JWT
        } else {
            response.put("success", false);
            response.put("message", "Identifiants incorrects");
        }

        return ResponseEntity.ok(response);
    }
}
