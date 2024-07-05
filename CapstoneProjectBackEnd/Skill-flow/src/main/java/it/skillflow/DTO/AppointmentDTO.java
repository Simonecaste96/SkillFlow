package it.skillflow.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class AppointmentDTO {

    @PastOrPresent
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime time;

    @NotNull
    private int skillExchangeRequestId;

}
