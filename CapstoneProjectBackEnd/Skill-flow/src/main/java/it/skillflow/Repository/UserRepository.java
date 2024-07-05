package it.skillflow.Repository;

import it.skillflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    public Optional<User> findByEmail(String email);
    public Optional<User> findByUsername(String username);

    public List<User> findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(String name, String surname);

    @Query("SELECT u.friends FROM User u WHERE u.id = :userId")
    List<User> findFriendsByUserId(@Param("userId") int userId);

    @Query
    List<String> findInterestsById(int UserId);
}
