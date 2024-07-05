package it.skillflow.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ChatRoomDTO {

    private int id;
    private List<ChatDTO> messages;
    private UserDTO sender;
    private UserDTO recipient;
}
