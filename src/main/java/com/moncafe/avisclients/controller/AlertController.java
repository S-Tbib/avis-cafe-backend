package com.moncafe.avisclients.controller;

import com.moncafe.avisclients.dto.Alert;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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
