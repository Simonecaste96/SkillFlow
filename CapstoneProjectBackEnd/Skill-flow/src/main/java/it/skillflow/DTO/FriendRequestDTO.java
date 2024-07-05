package it.skillflow.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FriendRequestDTO {
    private int senderId;
    private int recipientId;
    private LocalDateTime timestamp;
}