package it.skillflow.Controller;

import it.skillflow.Services.FriendRequestService;
import it.skillflow.entity.FriendRequest;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("skill_flow/friend_request")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void sendFriendRequest(@RequestParam int senderId, @RequestParam int receiverId) {
       friendRequestService.sendFriendRequest(senderId, receiverId);
    }

    @PutMapping("/respond/{requestId}/{accepted}")
    public void respondToFriendRequest(@PathVariable int requestId, @PathVariable boolean accepted) {
         friendRequestService.respondToFriendRequest(requestId, accepted);
    }

    @GetMapping("/received/{receiverId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<FriendRequest> getReceivedFriendRequests(@PathVariable int receiverId) {
        return friendRequestService.getReceivedFriendRequests(receiverId);
    }

    @GetMapping("/sent/{senderId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<FriendRequest> getSentFriendRequests(@PathVariable int senderId) {
        return friendRequestService.getSentFriendRequests(senderId);
    }

    @GetMapping("/{userId}/friends")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<User> getFriendList(@PathVariable int userId) {
        return friendRequestService.friendList(userId);
    }

    @GetMapping("/status")
    public String getFriendshipStatus(@RequestParam int userId, @RequestParam int otherUserId) {
        return friendRequestService.getFriendshipStatus(userId, otherUserId);
    }
}
