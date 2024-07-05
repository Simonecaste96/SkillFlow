package it.skillflow.Services;

import it.skillflow.DTO.AppointmentDTO;
import it.skillflow.DTO.SkillExchangeRequestDTO;
import it.skillflow.Enums.RequestStatus;
import it.skillflow.Repository.AppointmentRepository;
import it.skillflow.Repository.SkillExchangeRequestRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.Appointment;
import it.skillflow.entity.SkillExchangeRequest;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class SkillExchangeRequestService {

    @Autowired
    private SkillExchangeRequestRepository skillExchangeRequestRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Transactional
    public void createSkillExchangeRequest(SkillExchangeRequestDTO requestDTO) {

        Optional<User> userRequesterOptional = userRepository.findById(requestDTO.getRequesterId());
        System.out.println("ID INVIANTE " + requestDTO.getRequesterId());
        Optional<User> userResponderOptional = userRepository.findById(requestDTO.getResponderId());
        System.out.println("ID RICEVITORE " + requestDTO.getResponderId());

        if (userRequesterOptional.isPresent() && userResponderOptional.isPresent()) {
            SkillExchangeRequest newRequest = new SkillExchangeRequest();
            newRequest.setRequester(userRequesterOptional.get());
            newRequest.setResponder(userResponderOptional.get());
            newRequest.setDetails(requestDTO.getDetails());
            newRequest.setStatus(RequestStatus.PENDING);

            // Salva prima la richiesta di scambio competenze
            SkillExchangeRequest savedRequest = skillExchangeRequestRepository.save(newRequest);

            // Crea un nuovo appuntamento e associa la richiesta di scambio competenze salvata
            Appointment appointment = new Appointment();
            appointment.setAppointmentDate(LocalDate.parse(requestDTO.getAppointmentDate()));
            appointment.setAppointmentTime(LocalTime.parse(requestDTO.getAppointmentTime()));
            appointment.setSkillExchangeRequest(savedRequest);

            // Salva l'appuntamento
            appointmentRepository.save(appointment);

            // Associa l'appuntamento salvato alla richiesta di scambio competenze
            savedRequest.setAppointment(appointment);

            // Aggiorna la richiesta di scambio competenze con l'appuntamento associato
            skillExchangeRequestRepository.save(savedRequest);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Transactional
    public List<SkillExchangeRequest> getRequestByResponder(int responderId) {
        return skillExchangeRequestRepository.findByResponderIdAndStatus(responderId, RequestStatus.PENDING);
    }

    @Transactional
    public void acceptRequest(int requestId, boolean isAccepted) {
        SkillExchangeRequest request = skillExchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("SkillExchangeRequest not found"));

        if (isAccepted) {
            request.setStatus(RequestStatus.ACCEPTED);
            skillExchangeRequestRepository.save(request);
        } else {
            request.setStatus(RequestStatus.DECLINED);
            skillExchangeRequestRepository.save(request);
            appointmentService.deleteAppointment(request.getAppointment().getId());
        }

    }

}
