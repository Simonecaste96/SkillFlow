package it.skillflow.Repository;

import it.skillflow.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByRoomId(int roomId);
}
