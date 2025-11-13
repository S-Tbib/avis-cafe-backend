package com.moncafe.avisclients.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moncafe.avisclients.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.moncafe.avisclients.dto.LoginRequest;
import com.moncafe.avisclients.dto.RegisterRequest;
import com.moncafe.avisclients.model.User;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean register(RegisterRequest request) {
    // ✅ Vérifie d'abord
    if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
        return false;
    }
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        return false;
    }

    User user = new User();
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    userRepository.save(user);
    return true;
}

    public boolean login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return false; // User not found
        }
        User user = userOpt.get();
        return passwordEncoder.matches(request.getPassword(), user.getPassword());

    }

}
