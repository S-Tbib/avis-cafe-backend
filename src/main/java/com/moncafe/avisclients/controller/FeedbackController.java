package com.moncafe.avisclients.controller;
import com.moncafe.avisclients.model.Feedback;
import com.moncafe.avisclients.repository.FeedbackRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackRepository feedbackRepo;

    public FeedbackController(FeedbackRepository feedbackRepo) {
        this.feedbackRepo = feedbackRepo;
    }

    // GET /api/feedback
    @GetMapping("/feedback")
    public List<Feedback> getAllFeedback() {
        return feedbackRepo.findAll();
    }

    // DELETE /api/feedback/{id}
    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        feedbackRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
