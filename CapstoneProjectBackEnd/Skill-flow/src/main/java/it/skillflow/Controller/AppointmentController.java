package it.skillflow.Controller;

import it.skillflow.DTO.AppointmentDTO;
import it.skillflow.Services.AppointmentService;
import it.skillflow.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skill_flow")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    @GetMapping("/appointments/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<Appointment> getAppointmentsBySkillExchangeRequestId(@PathVariable int userId) {
        return appointmentService.getAppointmentsByUserId(userId);
    }





    @PutMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Appointment modifyAppointment(@RequestBody AppointmentDTO appointmentUpdate, @PathVariable int appointmentId) {
        return appointmentService.modifyAppointment(appointmentUpdate, appointmentId);
    }

    @DeleteMapping("/appointments/{appointmentId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void deleteAppointment(@PathVariable int appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
    }
}
