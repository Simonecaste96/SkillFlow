package it.skillflow.DTO;

import it.skillflow.Enums.InterestType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserDTO {

    @Size(max = 15, message = "Username cannot exceed 15 characters")
    private String username;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 30, message = "First name cannot exceed 30 characters")
    private String name;

    @NotBlank(message = "Last name cannot be empty")
    @Size(max = 30, message = "Last name cannot exceed 30 characters")
    private String surname;

    @NotNull(message = "Please enter your date of birth")
    @Past(message = "The date of birth must be in the past")
    //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Email(message = "Invalid email address")
    @Pattern(
            regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",
            message = "Invalid email address"
    )
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Please enter a valid password")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,}$",
            message = "The password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character."
    )
    private String password;

    private String pictureProfile;


    private List<String> interests;

    private List<SkillDTO> skills;


}
