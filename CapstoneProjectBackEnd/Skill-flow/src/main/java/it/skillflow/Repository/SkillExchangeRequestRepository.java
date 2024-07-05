package it.skillflow.Repository;

import it.skillflow.Enums.RequestStatus;
import it.skillflow.entity.SkillExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillExchangeRequestRepository extends JpaRepository<SkillExchangeRequest, Integer> {
   List<SkillExchangeRequest> findByResponderIdAndStatus(int responderId, RequestStatus status);
}
