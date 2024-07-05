package it.skillflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

   /* @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;*/

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    @JsonIncludeProperties({"id", "name", "surname", "pictureProfile"})
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewed_id", nullable = false)
    @JsonIgnore
    private User reviewed;

    private String reviewText;

    private int rating;
}
