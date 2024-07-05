package it.skillflow.Services;

import it.skillflow.DTO.ReviewDTO;
import it.skillflow.Repository.AppointmentRepository;

import it.skillflow.Repository.ReviewRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.Appointment;
import it.skillflow.entity.Review;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

@Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;


    public Review saveReview(ReviewDTO reviewDTO) {
        Optional<User> reviewerOptional = userRepository.findById(reviewDTO.getReviewer());
        Optional<User> reviewedOptional = userRepository.findById(reviewDTO.getReviewed());
        if(reviewedOptional.isPresent() && reviewerOptional.isPresent()){
            Review review = new Review();
            review.setReviewer(reviewerOptional.get());
            review.setReviewed(reviewedOptional.get());
            review.setReviewText(reviewDTO.getReviewText());
            review.setRating(reviewDTO.getRating());
            return reviewRepository.save(review);
        }
        throw new RuntimeException("User not found");
    }


    //una volta che una recensione è fatta non si può più eliminare ??? ci piace

    public List<Review> getReviewsByReviewedId(int reviewedId) {
        Optional<User> userOptional = userRepository.findById(reviewedId);
        if(userOptional.isEmpty()){
            throw new RuntimeException("User not found");
        }
        return reviewRepository.findByReviewedId(reviewedId);
    }

    public List<Review> getReviewsByReviewerId(int reviewerId) {
        Optional<User> userOptional = userRepository.findById(reviewerId);
        if(userOptional.isEmpty()){
            throw new RuntimeException("User not found");
        }
        return reviewRepository.findByReviewerId(reviewerId);

    }
}
