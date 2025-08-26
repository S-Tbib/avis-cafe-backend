package com.moncafe.avisclients.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être au moins 1")
    @Max(value = 5, message = "La note doit être au maximum 5")
    private Integer note;

    @Size(max = 255, message = "Le commentaire ne peut dépasser 255 caractères")
    private String commentaire;
    private String nomClient;
    private LocalDateTime dateAvis;
    @Column(name="numero_table")
    @JsonProperty("numeroTable")
    private Integer numeroTable;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public String getNomClient() {
        return nomClient;
    }

    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    public LocalDateTime getDateAvis() {
        return dateAvis;
    }

    public void setDateAvis(LocalDateTime dateAvis) {
        this.dateAvis = dateAvis;
    }

    public Integer getNumeroTable() {
        return numeroTable;
    }

    public void setNumeroTable(Integer numeroTable) {
      //  System.out.println("Setter numTable appelé avec valeur = " + numeroTable);
        this.numeroTable = numeroTable;
    }
}
