//package it.skillflow.Services;
//import it.skillflow.DTO.ChatDTO;
//import it.skillflow.Repository.ChatRepository;
//import it.skillflow.Repository.ChatRoomRepository;
//import it.skillflow.Repository.UserRepository;
//import it.skillflow.entity.Chat;
//import it.skillflow.entity.ChatRoom;
//import it.skillflow.entity.User;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class ChatService {
//    @Autowired
//    private ChatRepository chatRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ChatRoomRepository chatRoomRepository;
//
//    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
//
//    @Transactional
//    public ChatRoom saveMessage(ChatDTO chatDTO) {
//        logger.info("Saving message: {}", chatDTO);
//
//        // Verifica che il mittente e il destinatario esistano
//        User sender = userRepository.findById(chatDTO.getSenderId())
//                .orElseThrow(() -> new RuntimeException("Sender not found"));
//        User recipient = userRepository.findById(chatDTO.getRecipientId())
//                .orElseThrow(() -> new RuntimeException("Recipient not found"));
//
//        // Trova o crea una stanza di chat
//        ChatRoom room = findOrCreateRoom(sender, recipient);
//        logger.info("Chat room: {}", room);
//
//        // Crea un nuovo messaggio di chat
//        Chat chatMessage = new Chat();
//        logger.info("Message content: {}", chatDTO.getContent());
//        chatMessage.setContent(chatDTO.getContent());
//        logger.info("Message timestamp: {}", chatDTO.getTimestamp());
//        chatMessage.setTimestamp(LocalDateTime.parse(chatDTO.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME));
//        logger.info("Sender ID: {}, Recipient ID: {}", chatDTO.getSenderId(), chatDTO.getRecipientId());
//        logger.info("Room ID: {}", room.getId());
//        chatMessage.setRoom(room);
//
//        // Aggiungi il messaggio alla lista dei messaggi della stanza
//        room.getMessages().add(chatMessage);
//
//        // Salva il messaggio di chat e la stanza di chat
//        chatRepository.save(chatMessage);
//        logger.info("Message saved: {}", chatMessage);
//        ChatRoom savedRoom = chatRoomRepository.save(room);
//        logger.info("Chat room updated: {}", savedRoom);
//
//        return savedRoom;
//    }
//
//    private ChatRoom findOrCreateRoom(User sender, User recipient) {
//        List<ChatRoom> existingRooms = chatRoomRepository.findByUsers(sender.getId(), recipient.getId());
//        if (!existingRooms.isEmpty()) {
//            logger.info("Existing room found: {}", existingRooms.get(0));
//            return existingRooms.get(0);
//        } else {
//            logger.info("No existing room found, creating a new room");
//            ChatRoom newRoom = new ChatRoom();
//            newRoom.setSender(sender);
//            newRoom.setRecipient(recipient);
//            newRoom.setMessages(new ArrayList<>());
//            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
//            logger.info("New room created: {}", savedRoom);
//            return savedRoom;
//        }
//    }
//
//    public List<Chat> findMessagesByRoomId(int roomId) {
//        return chatRepository.findByRoomId(roomId);
//    }
//
//    public List<Chat> findByParticipants(int user1, int user2) {
//        List<Integer> roomIds = chatRoomRepository.findRoomIdsByUsers(user1, user2);
//        if (!roomIds.isEmpty()) {
//            return findMessagesByRoomId(roomIds.get(0));
//        } else {
//            return new ArrayList<>();
//        }
//    }
//}
package it.skillflow.Services;

import it.skillflow.DTO.ChatDTO;
import it.skillflow.DTO.ChatRoomDTO;
import it.skillflow.DTO.UserDTO;
import it.skillflow.Repository.ChatRepository;
import it.skillflow.Repository.ChatRoomRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.Chat;
import it.skillflow.entity.ChatRoom;
import it.skillflow.entity.User;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Transactional
    public ChatRoom saveMessage(ChatDTO chatDTO) {
        logger.info("Saving message: {}", chatDTO);

        System.out.println("Sender ID: " + chatDTO.getSender());
        // Verifica che il mittente e il destinatario esistano
        User sender = userRepository.findById(chatDTO.getSender())
                .orElseThrow(() -> new RuntimeException("Sender not found"));


        User recipient = userRepository.findById(chatDTO.getRecipient())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Trova o crea una stanza di chat
        ChatRoom room = findOrCreateRoom(sender, recipient);
        logger.info("Chat room: {}", room);

        // Crea un nuovo messaggio di chat
        Chat chatMessage = new Chat();
        chatMessage.setRecipient(recipient);
        chatMessage.setSender(sender);
        chatMessage.setContent(chatDTO.getContent());
        chatMessage.setTimestamp(LocalDateTime.parse(chatDTO.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME));
        chatMessage.setRoom(room);

        // Aggiungi il messaggio alla lista dei messaggi della stanza
        room.getMessages().add(chatMessage);

        // Salva il messaggio di chat e la stanza di chat
        chatRepository.save(chatMessage);
        logger.info("Message saved: {}", chatMessage);
        ChatRoom savedRoom = chatRoomRepository.save(room);
        logger.info("Chat room updated: {}", savedRoom);

        return savedRoom;
    }

    private ChatRoom findOrCreateRoom(User sender, User recipient) {
        List<ChatRoom> existingRooms = chatRoomRepository.findByUsers(sender.getId(), recipient.getId());
        if (!existingRooms.isEmpty()) {
            logger.info("Existing room found: {}", existingRooms.get(0));
            return existingRooms.get(0);
        } else {
            logger.info("No existing room found, creating a new room");
            ChatRoom newRoom = new ChatRoom();
            newRoom.setSender(sender);
            newRoom.setRecipient(recipient);
            newRoom.setMessages(new ArrayList<>());
            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
            logger.info("New room created: {}", savedRoom);
            return savedRoom;
        }
    }

    public List<Chat> findMessagesByRoomId(int roomId) {
        return chatRepository.findByRoomId(roomId);
    }

    public int findByParticipants(int user1, int user2) {
        List<Integer> roomIds = chatRoomRepository.findRoomIdsByUsers(user1, user2);
        if (!roomIds.isEmpty()) {
            System.out.println(roomIds.getFirst());
           return roomIds.getFirst();
        } else {
            return 0;
        }
    }
/*
    @Transactional(readOnly = true)
    public ChatDTO convertToChatDTO(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setContent(chat.getContent());
        chatDTO.setTimestamp(chat.getTimestamp().toString());
        chatDTO.setRoomId(chat.getRoom().getId());
        chatDTO.setSenderId(chat.getRoom().getSender().getId());
        //chatDTO.setRecipientId(chat.getRoom().getRecipient().getId());
        return chatDTO;
    }

    @Transactional(readOnly = true)
    public ChatRoomDTO convertToChatRoomDTO(ChatRoom chatRoom) {
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setId(chatRoom.getId());
        chatRoomDTO.setMessages(chatRoom.getMessages().stream()
                .map(this::convertToChatDTO)
                .collect(Collectors.toList()));



        // Imposta il mittente e il destinatario
        UserDTO senderDTO = new UserDTO();

        senderDTO.setName(chatRoom.getSender().getName());
        chatRoomDTO.setSender(senderDTO);

        UserDTO recipientDTO = new UserDTO();

        recipientDTO.setName(chatRoom.getRecipient().getName());
        chatRoomDTO.setRecipient(recipientDTO);

        return chatRoomDTO;
    }

    @Transactional(readOnly = true)
    public ChatRoomDTO getChatRoomDTO(int roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("ChatRoom not found"));


        return convertToChatRoomDTO(chatRoom);
    }
    */

}
