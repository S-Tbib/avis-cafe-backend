    // controller/AuthController.java
package com.moncafe.avisclients.controller;

<<<<<<< HEAD
import com.moncafe.avisclients.dto.LoginRequest;
import com.moncafe.avisclients.dto.RegisterRequest;
import com.moncafe.avisclients.service.UserService;
import com.moncafe.avisclients.service.JwtService;
import com.moncafe.avisclients.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
=======
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8080")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

<<<<<<< HEAD
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.register(request)) {
            return ResponseEntity.ok(Map.of("message", "Compte créé avec succès !"));
=======
        if ("admin".equals(username) && "admin".equals(password)) {
            response.put("success", true);
            response.put("token", "123456"); // Je peut générer un token plus sécurisé ici
        } else {
            response.put("success", false);
            response.put("message", "Identifiants incorrects");
>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Email déjà utilisé."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(Map.of(
                    "token", jwtToken,
                    "email", request.getEmail()
            ));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
        }
    }
}
