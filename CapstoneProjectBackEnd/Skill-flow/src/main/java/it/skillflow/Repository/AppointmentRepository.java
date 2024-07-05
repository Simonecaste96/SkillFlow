package it.skillflow.Repository;

import it.skillflow.entity.Appointment;
import it.skillflow.entity.SkillExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT a FROM Appointment a JOIN a.skillExchangeRequest ser WHERE ser.responder.id = :responderId AND ser.status = 'ACCEPTED'")
    List<Appointment> findAppointmentsByUserId(@Param("responderId") int responderId);

}
