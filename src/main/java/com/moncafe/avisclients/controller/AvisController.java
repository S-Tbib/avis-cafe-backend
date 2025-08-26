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

import com.moncafe.avisclients.model.Avis;
import com.moncafe.avisclients.service.AvisService;

@RestController
@RequestMapping("/api/avis")

public class AvisController {

    @Autowired
    private AvisService avisService;

    @PostMapping("/batch")
    public ResponseEntity<List<Avis>> ajouterPlusieursAvis(@RequestBody List<Avis> avisList) {
        List<Avis> nouveauxAvis = avisService.ajouterPlusieursAvis(avisList);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauxAvis);
    }

    // 1️⃣ Ajouter un avis (POST)
    @PostMapping
    public ResponseEntity<Avis> ajouterAvis(@RequestBody Avis avis) {
        Avis nouvelAvis = avisService.ajouterAvis(avis);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelAvis);
    }

    // 2️⃣ Lister tous les avis (GET)
    @GetMapping
    public List<Avis> getTousLesAvis() {
        return avisService.obtenirTousLesAvis();
    }

    // 3️⃣ Récupérer un avis par ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Avis> getAvisParId(@PathVariable Long id) {
        Optional<Avis> avis = avisService.getAvisParId(id);
        return avis.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4️⃣ Mettre à jour un avis (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Avis> mettreAJourAvis(@PathVariable Long id, @RequestBody Avis avis) {
        System.out.println("POST/PUT reçu numTable = " + avis.getNumeroTable());
        Optional<Avis> avisExistant = avisService.getAvisParId(id);
        if (avisExistant.isPresent()) {
            Avis avisMaj = avisService.mettreAJourAvis(id, avis);
            return ResponseEntity.ok(avisMaj);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5️⃣ Supprimer un avis (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAvis(@PathVariable Long id) {
        Optional<Avis> avisExistant = avisService.getAvisParId(id);
        if (avisExistant.isPresent()) {
            avisService.supprimerAvis(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
