package it.skillflow.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;


@ManyToOne
@JoinColumn(name = "sender_id")
@JsonIncludeProperties({"name","id"}) // OPPURE ID
private User sender;


    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @JsonIncludeProperties({"name","id"}) // OPPURE ID
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ChatRoom room;


}
