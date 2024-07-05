package it.skillflow.Services;

import it.skillflow.Enums.RequestStatus;
import it.skillflow.Exception.UserNotFoundException;
import it.skillflow.Repository.FriendRequestRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.FriendRequest;
import it.skillflow.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    public List<User> friendList(int userId) {
        return userRepository.findFriendsByUserId(userId);
    }

    @Transactional
    public void sendFriendRequest(int senderId, int receiverId) {
        if (senderId == receiverId) {
            throw new RuntimeException("Sender and receiver cannot be the same person");
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Verifica se la richiesta di amicizia è già presente (da sender a receiver o da receiver a sender)
        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        Optional<FriendRequest> existingReverseRequest = friendRequestRepository.findBySenderAndReceiver(receiver, sender);

        if ((existingRequest.isPresent() && (existingRequest.get().getStatus() == RequestStatus.PENDING || existingRequest.get().getStatus() == RequestStatus.ACCEPTED)) ||
                (existingReverseRequest.isPresent() && (existingReverseRequest.get().getStatus() == RequestStatus.PENDING || existingReverseRequest.get().getStatus() == RequestStatus.ACCEPTED))) {
            throw new RuntimeException("Friend request already sent");
        }

        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setSender(sender);
        friendRequest.setReceiver(receiver);
        friendRequest.setStatus(RequestStatus.PENDING);

        friendRequestRepository.save(friendRequest);

        // Invia una notifica tramite WebSocket al destinatario della richiesta di amicizia
        //notificationService.notifyFriendRequest(friendRequest);

    }

    @Transactional
    public void respondToFriendRequest(int requestId, boolean accepted) {
        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (accepted) {
            friendRequest.setStatus(RequestStatus.ACCEPTED);
            User sender = friendRequest.getSender();
            User receiver = friendRequest.getReceiver();

            sender.getFriends().add(receiver);
            receiver.getFriends().add(sender);
            userRepository.save(sender);
            userRepository.save(receiver);
        } else {
            friendRequest.setStatus(RequestStatus.DECLINED);
        }

        friendRequestRepository.save(friendRequest);

        // Invia una notifica tramite WebSocket al destinatario della risposta della richiesta di amicizia
       // messagingTemplate.convertAndSend("/topic/friend-requests/" + friendRequest.getReceiver().getId(), friendRequest);


    }

    public List<FriendRequest> getReceivedFriendRequests(int receiverId) {
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));
        return friendRequestRepository.findByReceiverAndStatus(receiver, RequestStatus.PENDING);
    }

    public List<FriendRequest> getSentFriendRequests(int senderId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        return friendRequestRepository.findBySenderAndStatus(sender, RequestStatus.PENDING);
    }

    public String getFriendshipStatus(int userId, int otherUserId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User otherUser = userRepository.findById(otherUserId).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<FriendRequest> sentRequest = friendRequestRepository.findBySenderAndReceiver(user, otherUser);
        Optional<FriendRequest> receivedRequest = friendRequestRepository.findBySenderAndReceiver(otherUser, user);

        if (sentRequest.isPresent()) {
            if (sentRequest.get().getStatus() == RequestStatus.PENDING) {
                return "Richiesta inviata";
            } else if (sentRequest.get().getStatus() == RequestStatus.ACCEPTED) {
                return "Siete già amici";
            }
        } else if (receivedRequest.isPresent()) {
            if (receivedRequest.get().getStatus() == RequestStatus.PENDING) {
                return "Richiesta ricevuta";
            } else if (receivedRequest.get().getStatus() == RequestStatus.ACCEPTED) {
                return "Siete già amici";
            }
        }
        return "Aggiungi agli amici";
    }
}
