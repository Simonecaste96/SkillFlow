package it.skillflow.Repository;

import it.skillflow.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer>{
    List<Review> findByReviewerId(int userId);

    List<Review> findByReviewedId(int userId);
}
