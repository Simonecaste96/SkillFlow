package it.skillflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatDTO {

    private int sender;

    private int recipient;

    private String content;

    //prima er LocalDateTime
    private String timestamp;

    private int roomId;
}