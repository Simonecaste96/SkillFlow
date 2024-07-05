package it.skillflow.Controller;

import it.skillflow.DTO.ReviewDTO;
import it.skillflow.Services.ReviewService;
import it.skillflow.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skill_flow")
public class ReviewController {


    @Autowired
    private ReviewService reviewService;

    @PostMapping("/review")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Review createReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.saveReview(reviewDTO);
    }

// recupero recensioni per utente RECENSITO
    @GetMapping("/review_reviewed/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<Review> getReviewsByReviewed(@PathVariable int userId) {
        return reviewService.getReviewsByReviewedId(userId);
    }

// recupero recensioni per utente RECENSORE
    @GetMapping("/review_reviewer/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<Review> getReviewsByReviewer(@PathVariable int userId) {
        return reviewService.getReviewsByReviewerId(userId);
    }
}
