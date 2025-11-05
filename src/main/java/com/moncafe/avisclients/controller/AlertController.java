package com.moncafe.avisclients.controller;

import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moncafe.avisclients.dto.Alert;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AlertController {

    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return List.of(
                new Alert(1L, "Nouvel avis", "Un client a laissé un avis", "blue", "info", new Date(), false),
                new Alert(2L, "Tendance négative", "La note moyenne baisse", "red", "exclamation-triangle", new Date(), false)
        );
    }
}
