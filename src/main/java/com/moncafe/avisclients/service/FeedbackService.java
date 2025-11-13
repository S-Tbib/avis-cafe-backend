package com.moncafe.avisclients.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.moncafe.avisclients.model.Feedback;
import com.moncafe.avisclients.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Ajouter plusieurs avis
    public List<Feedback> ajouterPlusieursAvis(List<Feedback> feedbackList) {
        return feedbackRepository.saveAll(feedbackList);
    }

    // Ajouter un avis
    public Feedback ajouterAvis(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // Obtenir tous les avis
    public List<Feedback> obtenirTousLesAvis() {
        return feedbackRepository.findAll();
    }
    // obtient un avis par ID

    public Optional<Feedback> getAvisParId(Long id) {
        return feedbackRepository.findById(id);
    }
    // Mettre à jour un avis

    public Feedback mettreAJourAvis(Long id, Feedback feedback) {
        return feedbackRepository.findById(id).map(a -> {
            a.setName(feedback.getName());
            a.setComment(feedback.getComment());
            a.setRating(feedback.getRating());
            a.setTableNumber(feedback.getTableNumber());  // <-- Important !
            a.setDate(feedback.getDate());
            return feedbackRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'ID : " + id));
    }

    // Supprimer un avis
    public void supprimerAvis(Long id) {
        feedbackRepository.deleteById(id);
    }
}
