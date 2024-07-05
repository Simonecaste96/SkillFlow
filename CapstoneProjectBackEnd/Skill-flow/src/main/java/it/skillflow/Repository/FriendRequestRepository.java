package it.skillflow.Repository;

import it.skillflow.Enums.RequestStatus;
import it.skillflow.entity.FriendRequest;
import it.skillflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    //query per ricercare richeista di amicizia per inviante e ricevitore
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    //query per ricercare
    //restituisce richiesta di amicizia per ricevitore ed il suo stato
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);

    List<FriendRequest> findBySenderAndStatus(User sender, RequestStatus status);
}
