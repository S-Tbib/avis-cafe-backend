package com.moncafe.avisclients.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moncafe.avisclients.model.Avis;
import com.moncafe.avisclients.repository.AvisRepository;

@Service
public class AvisService {

    @Autowired
    private AvisRepository avisRepository;
    // Ajouter plusieurs avis
    public List<Avis> ajouterPlusieursAvis(List<Avis> avisList) {
    return avisRepository.saveAll(avisList);
}


    // Ajouter un avis
    public Avis ajouterAvis(Avis avis) {
        return avisRepository.save(avis);
    }

    // Obtenir tous les avis
    public List<Avis> obtenirTousLesAvis() {
        return avisRepository.findAll();
    }
    // obtient un avis par ID

    public Optional<Avis> getAvisParId(Long id) {
        return avisRepository.findById(id);
    }
    // Mettre à jour un avis

    public Avis mettreAJourAvis(Long id, Avis avis) {
        return avisRepository.findById(id).map(a -> {
            a.setNomClient(avis.getNomClient());
            a.setCommentaire(avis.getCommentaire());
            a.setNote(avis.getNote());
            a.setNumeroTable(avis.getNumeroTable());  // <-- Important !
            a.setDateAvis(avis.getDateAvis());
            return avisRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'ID : " + id));
    }

    // Supprimer un avis
    public void supprimerAvis(Long id) {
        avisRepository.deleteById(id);
    }
}
