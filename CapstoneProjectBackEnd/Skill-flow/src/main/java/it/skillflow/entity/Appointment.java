package it.skillflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;


@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;



    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_exchange_request_id", nullable = false)
    @JsonIncludeProperties({"details", "requester"})
    private SkillExchangeRequest skillExchangeRequest;

  /*  @OneToMany(mappedBy = "appointment")
    private List<Review> reviews;*/
}
