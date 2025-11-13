package com.moncafe.avisclients.model;
<<<<<<< HEAD
=======

>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;
    private String tableNumber;
    private int rating;
    private String name;
    private String comment;
<<<<<<< HEAD
    public Feedback() {
    }
=======

    public Feedback() {
    }

>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
    public Feedback(long id, LocalDateTime date, String tableNumber, int rating, String name, String comment) {
        this.id = id;
        this.date = date;
        this.tableNumber = tableNumber;
        this.rating = rating;
        this.name = name;
        this.comment = comment;
    }
<<<<<<< HEAD
    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }
    public LocalDateTime getDate() {
        return date;
    }
=======

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getDate() {
        return date;
    }

>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getTableNumber() {
        return tableNumber;
    }
<<<<<<< HEAD
    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getComment() {
        return comment;
    }
=======

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
    public void setComment(String comment) {
        this.comment = comment;
    }

}
