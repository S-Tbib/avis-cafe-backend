package com.moncafe.avisclients.repository;

import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
}
=======
import com.moncafe.avisclients.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}
>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
