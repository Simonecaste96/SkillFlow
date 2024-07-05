package it.skillflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import it.skillflow.Enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;



@Entity
@Data
public class SkillExchangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne //(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    @JsonIncludeProperties({"id", "name", "surname", "pictureProfile"}) //GRANDE IMPORTANZA PER EVITARE IL LOOP INFINITO
    private User requester;

    @ManyToOne //(fetch = FetchType.LAZY)
    @JoinColumn(name = "responder_id", nullable = false)
    @JsonIncludeProperties({"id", "name", "surname", "pictureProfile"})
    private User responder;


    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "skillExchangeRequest")
    @JsonBackReference
    private Appointment appointment;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private RequestStatus status; // Uso l'enums RequestStatus che uso anche pe le richieste di amicizia

    private String details; // argomento dell'scambio
}
