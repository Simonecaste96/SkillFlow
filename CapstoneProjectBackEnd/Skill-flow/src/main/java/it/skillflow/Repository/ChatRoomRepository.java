package it.skillflow.Repository;


import it.skillflow.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer>{
    // mifaccio dare tutta la lista della chat
    @Query("SELECT r FROM ChatRoom r WHERE (r.sender.id = :user1 AND r.recipient.id = :user2) OR (r.sender.id = :user2 AND r.recipient.id = :user1)")
    List<ChatRoom> findByUsers(@Param("user1") int user1, @Param("user2") int user2);



//mi faccio dare l'id della room dati gli utenti
    @Query("SELECT r.id FROM ChatRoom r WHERE (r.sender.id = :user1 AND r.recipient.id = :user2) OR (r.sender.id = :user2 AND r.recipient.id = :user1)")
    List<Integer> findRoomIdsByUsers(@Param("user1") int user1, @Param("user2") int user2);
/*
    @Query("SELECT r FROM ChatRoom r JOIN r.sender s JOIN r.recipient n  WHERE (s.id = :user OR n.id = :user)")
    List<ChatRoom> findByParticipants(@Param("user") int user);*/
}


