package com.moncafe.avisclients.repository;
import com.moncafe.avisclients.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
}