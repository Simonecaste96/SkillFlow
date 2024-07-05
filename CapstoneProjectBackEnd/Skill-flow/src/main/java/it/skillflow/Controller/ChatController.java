//package it.skillflow.Controller;
//
//import it.skillflow.DTO.ChatDTO;
//import it.skillflow.Repository.ChatRoomRepository;
//import it.skillflow.Services.ChatService;
//import it.skillflow.Services.NotificationService;
//import it.skillflow.entity.Chat;
//import it.skillflow.entity.ChatRoom;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.messaging.simp.annotation.SendToUser;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//public class ChatController {
//
//    @Autowired
//    private ChatService chatService;
//
//    @Autowired
//    private ChatRoomRepository chatRoomRepository;
//
//
//    @Autowired
//    private NotificationService notificationService;
//    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
//
//    @MessageMapping("/private")
//    @SendToUser("/queue/private")
//    public ChatRoom sendPrivateMessage(@Payload ChatDTO message, SimpMessageHeaderAccessor headerAccessor) {
//        logger.info("Received private message: {}", message);
//        ChatRoom savedMessage = chatService.saveMessage(message);
//        notificationService.sendMessage(String.valueOf(message.getRecipientId()), savedMessage);
//        logger.info("Sent private message to user: {}", message.getRecipientId());
//        return savedMessage;
//    }
//
//
//    @GetMapping("/skill_flow/chat/history/{user1}/{user2}")
//    public List<Chat> getChatHistory(@PathVariable int user1, @PathVariable int user2) {
//        return chatService.findByParticipants(user1, user2);
//    }
//
//    @GetMapping("/skill_flow/chat/room-id/{user1}/{user2}")
//    public List<Integer> getRoomIUd(@PathVariable int user1, @PathVariable int user2) {
//        return chatRoomRepository.findRoomIdsByUsers(user1, user2);
//    }
//}

package it.skillflow.Controller;

import it.skillflow.DTO.ChatDTO;
import it.skillflow.DTO.ChatRoomDTO;
import it.skillflow.Services.ChatService;
import it.skillflow.Services.NotificationService;
import it.skillflow.entity.Chat;
import it.skillflow.Repository.ChatRoomRepository;
import it.skillflow.entity.ChatRoom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
/*
    @MessageMapping("/private")
    @SendToUser("/queue/private")
    public ChatRoomDTO sendPrivateMessage(@Payload ChatDTO message, SimpMessageHeaderAccessor headerAccessor) {
        logger.info("Received private message: {}", message);
        ChatRoom savedMessage = chatService.saveMessage(message);
        notificationService.sendMessage(String.valueOf(message.getRecipientId()), savedMessage);
        logger.info("Sent private message to user: {}", message.getRecipientId());
        return chatService.convertToChatRoomDTO(savedMessage);
    }
*/
/*
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatDTO chat (@DestinationVariable String roomId, ChatDTO message) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setRoomId(chatDTO.getRoomId());
        chatDTO.setSenderId(message.getSenderId());
        chatDTO.setRecipientId(message.getRecipientId());
        chatDTO.setContent(message.getContent());
        chatDTO.setTimestamp(message.getTimestamp());
        chatService.saveMessage(chatDTO);
        return chatDTO;

    }
    */

    //
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatDTO chat(@DestinationVariable String roomId, ChatDTO message) {
        message.setRoomId(Integer.parseInt(roomId));  // Assicurati di impostare il roomId dal path variable
        chatService.saveMessage(message);  // Salva il messaggio originale
        return message;  // Ritorna direttamente il messaggio originale
    }


    @GetMapping("/skill_flow/chat/history/{roomId}")
    public List<Chat> getChatHistory(@PathVariable int roomId) {
        return chatService.findMessagesByRoomId(roomId);
    }

    @GetMapping("/skill_flow/chat/room-id/{user1}/{user2}")
    public int getRoomId(@PathVariable int user1, @PathVariable int user2) {
        return chatService.findByParticipants(user1, user2);
    }
}

