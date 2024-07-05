package it.skillflow.Controller;

import it.skillflow.DTO.SkillDTO;
import it.skillflow.Services.SkillService;
import it.skillflow.entity.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skill_flow")
@CrossOrigin(origins = "*")
public class SkillController {


    @Autowired
    private SkillService skillService;



    @PostMapping("/skills/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void saveSkill(@RequestBody SkillDTO skillDTO, @PathVariable int userId){
        skillService.saveSkillUser(skillDTO,userId);
    }

    @PutMapping("/skills/{skillId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void updateSkill(@RequestBody SkillDTO skillUpdate, @PathVariable int userId){
        skillService.updateSkill(skillUpdate,userId);
    }


    @GetMapping("/skills/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<Skill> getSkills(@PathVariable int userId){
        return skillService.getSkillsByUserId(userId);
    }

    @DeleteMapping("/skills/{skillId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void deleteSkill(@PathVariable int skillId){
        skillService.deleteSkill(skillId);
    }





}
