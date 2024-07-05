//package it.skillflow.Services;
//
//import it.skillflow.DTO.ChatDTO;
//import it.skillflow.entity.Chat;
//import it.skillflow.entity.ChatRoom;
//import it.skillflow.entity.FriendRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class NotificationService {
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    public void notifyFriendRequest(FriendRequest friendRequest) {
//        messagingTemplate.convertAndSend("/topic/friend-requests", friendRequest);
//        System.out.println("Friend request notification sent: " + friendRequest);
//    }
////send messaggio privato
//    public void sendMessage(String recipientId, ChatRoom message) {
//        messagingTemplate.convertAndSendToUser(recipientId, "/queue/private", message);
//
//        System.out.println("Message sent to user: " + recipientId + ", Message: " + message);
//    }
//
//}
package it.skillflow.Services;

import it.skillflow.DTO.ChatDTO;
import it.skillflow.entity.Chat;
import it.skillflow.entity.ChatRoom;
import it.skillflow.entity.FriendRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyFriendRequest(FriendRequest friendRequest) {
        messagingTemplate.convertAndSend("/topic/friend-requests", friendRequest);
        System.out.println("Friend request notification sent: " + friendRequest);
    }
    //send messaggio privato
    public void sendMessage(String recipientId, ChatRoom message) {
        messagingTemplate.convertAndSendToUser(recipientId, "/topic/{recipientId}", message);

        System.out.println("Message sent to user: " + recipientId + ", Message: " + message);
    }

}
