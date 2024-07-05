package it.skillflow.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {

    @Email(message = "Inserire l'email usata in fase di registrazione")
    @NotBlank(message = "Inserire l'email")
    private String email;

    @NotBlank(message = "Inserire la password")
    private String password;
}
