package it.skillflow.Services;

import it.skillflow.DTO.AppointmentDTO;
import it.skillflow.Enums.RequestStatus;
import it.skillflow.Repository.AppointmentRepository;
import it.skillflow.Repository.SkillExchangeRequestRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.Appointment;
import it.skillflow.entity.SkillExchangeRequest;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private SkillExchangeRequestRepository skillExchangeRequestRepository;



    public List<Appointment> getAppointmentsByUserId(int responderId) {
        return appointmentRepository.findAppointmentsByUserId(responderId);
    }

    public void saveAppointment(AppointmentDTO appointmentDTO) {
        Optional<SkillExchangeRequest> requestOptional = skillExchangeRequestRepository.findById(appointmentDTO.getSkillExchangeRequestId());
        if (requestOptional.isPresent()) {

            Appointment appointment = new Appointment();
            appointment.setSkillExchangeRequest(requestOptional.get());
            appointment.setAppointmentDate(appointmentDTO.getDate());
            appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Skill Exchange Request not found");
    }

// per adesso la modifica non richiede il permesso, ma avviene e basta
    public Appointment modifyAppointment(AppointmentDTO appointmentUpdate, int appointmentId) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(appointmentId);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setAppointmentDate(appointmentUpdate.getDate());
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Appointment not found");
    }

    public void deleteAppointment(int appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

}
