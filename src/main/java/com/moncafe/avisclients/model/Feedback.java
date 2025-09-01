package com.moncafe.avisclients.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date; // tu peux utiliser LocalDateTime aussi
    private String tableNumber;
    private int rating;
    private String name;
    private String comment;
}
