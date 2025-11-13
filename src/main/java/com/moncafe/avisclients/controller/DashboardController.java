/*package com.moncafe.avisclients.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moncafe.avisclients.model.Review;
import com.moncafe.avisclients.repository.ReviewRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<Review> reviews = reviewRepository.findAll();

        long totalReviews = reviews.size();
        double avgRating = reviews.stream()
                                  .mapToDouble(Review::getRating)
                                  .average()
                                  .orElse(0.0);
        long positiveReviews = reviews.stream().filter(r -> r.getRating() >= 4).count();
        long negativeReviews = reviews.stream().filter(r -> r.getRating() <= 2).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", totalReviews);
        stats.put("avgRating", avgRating);
        stats.put("positiveReviews", positiveReviews);
        stats.put("negativeReviews", negativeReviews);

        return stats;
    }
}
/*async function loadStats() {
    try {
        const response = await fetch('/api/dashboard/stats'); // endpoint Spring Boot
        const stats = await response.json();

        document.getElementById('totalReviews').innerText = stats.totalReviews;
        document.getElementById('avgRating').innerText = stats.avgRating.toFixed(1);
        document.getElementById('positiveReviews').innerText = stats.positiveReviews;
        document.getElementById('negativeReviews').innerText = stats.negativeReviews;

    } catch (error) {
        console.error("Erreur lors du chargement des stats:", error);
    }
}

// Appel automatique au chargement de la page
loadStats();
 */