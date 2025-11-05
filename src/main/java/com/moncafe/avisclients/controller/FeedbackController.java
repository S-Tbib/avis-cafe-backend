package com.moncafe.avisclients.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moncafe.avisclients.model.Feedback;
import com.moncafe.avisclients.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")

public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/batch")
    public ResponseEntity<List<Feedback>> ajouterPlusieursAvis(@RequestBody List<Feedback> Feedback) {
        List<Feedback> newFeedback = feedbackService.ajouterPlusieursAvis(Feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(newFeedback);
    }

    // Ajouter un avis (POST)
    @PostMapping
    public ResponseEntity<Feedback> ajouterAvis(@RequestBody Feedback feedback) {
        Feedback newFeedback = feedbackService.ajouterAvis(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(newFeedback);
    }

    //  Lister tous les avis (GET)
    @GetMapping
    public List<Feedback> getTousLesAvis() {
        return feedbackService.obtenirTousLesAvis();
    }

    //  Récupérer un avis par ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getAvisParId(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackService.getAvisParId(id);
        return feedback.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //  Mettre à jour un avis (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> mettreAJourAvis(@PathVariable Long id, @RequestBody Feedback feedback) {
        System.out.println("POST/PUT reçu numTable = " + feedback.getTableNumber());
        Optional<Feedback> ExistatFeedback = feedbackService.getAvisParId(id);
        if (ExistatFeedback.isPresent()) {
            Feedback avisMaj = feedbackService.mettreAJourAvis(id, feedback);
            return ResponseEntity.ok(avisMaj);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //  Supprimer un avis (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAvis(@PathVariable Long id) {
        Optional<Feedback> ExisantFeedback = feedbackService.getAvisParId(id);
        if (ExisantFeedback.isPresent()) {
            feedbackService.supprimerAvis(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
