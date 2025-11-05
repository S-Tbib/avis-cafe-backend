package com.moncafe.avisclients.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.moncafe.avisclients.model.Admin;
import com.moncafe.avisclients.service.AdminService;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Injecter le password encoder
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Show login form
    @GetMapping("/login")
    public String showLogin() {
        return "login";
    }

    // Handle login submission
    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            Model model) {

        Admin admin = adminService.findByEmail(email);

        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            session.setAttribute("adminId", admin.getId());
            session.setAttribute("adminEmail", admin.getEmail());
            return "redirect:/dashboard";
        } else {
            model.addAttribute("error", "Invalid email or password.");
            return "login";
        }
    }

    // Show registration form
    @GetMapping("/register")
    public String showRegister() {
        return "register";
    }

    // Handle new admin registration
    @PostMapping("/register")
    public String register(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            Model model) {

        if (!password.equals(confirmPassword)) {
            model.addAttribute("error", "Passwords do not match.");
            return "register";
        }

        if (adminService.existsByEmail(email)) {
            model.addAttribute("error", "An admin with this email already exists.");
            return "register";
        }

        Admin admin = new Admin();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setEmail(email);

        // Encode password before saving
        admin.setPassword(passwordEncoder.encode(password));

        adminService.save(admin);
        model.addAttribute("success", "Account created successfully! You can now log in.");
        return "login";
    }

    // Dashboard (protected)
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (session.getAttribute("adminId") == null) {
            return "redirect:/login";
        }
        model.addAttribute("email", session.getAttribute("adminEmail"));
        return "dashboard";
    }

    // Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
