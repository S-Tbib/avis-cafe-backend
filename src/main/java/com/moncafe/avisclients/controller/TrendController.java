package com.moncafe.avisclients.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
@CrossOrigin(origins = "*")
public class TrendController {

    @GetMapping("/weekly")
    public Map<String, Object> getWeeklyTrends() {
        return Map.of(
            "days", List.of("Lun","Mar","Mer","Jeu","Ven","Sam","Dim"),
            "averageRatings", List.of(4.0,4.2,3.8,4.5,4.1,4.3,4.4),
            "feedbackCounts", List.of(2,3,1,5,2,4,3)
        );
    }
}
