package com.moncafe.avisclients.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.moncafe.avisclients.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}
