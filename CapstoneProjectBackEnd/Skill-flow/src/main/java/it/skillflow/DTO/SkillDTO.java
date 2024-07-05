package it.skillflow.DTO;
import it.skillflow.Enums.LevelExperience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SkillDTO {

 @NotBlank(message = "Skill name is required")
 private String name;

 @NotBlank(message = "Skill level is required")
 private String level;

 @NotBlank(message = "Skill description is required")
 private String description;

 private String certificateBy;

 private LocalDate certificateDate;

 private int userId;

}
