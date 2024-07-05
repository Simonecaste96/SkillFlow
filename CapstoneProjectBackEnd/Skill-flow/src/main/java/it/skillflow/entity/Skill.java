package it.skillflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.skillflow.Enums.LevelExperience;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Enumerated(EnumType.STRING)
    private LevelExperience level;

    private String description;

    private String certificateBy;

    private LocalDate certificateDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
