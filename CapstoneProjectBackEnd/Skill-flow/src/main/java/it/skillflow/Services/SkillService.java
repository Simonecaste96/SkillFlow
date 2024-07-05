package it.skillflow.Services;

import it.skillflow.DTO.SkillDTO;
import it.skillflow.Enums.LevelExperience;
import it.skillflow.Exception.UserNotFoundException;
import it.skillflow.Repository.SkillRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.entity.Skill;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;



    public void saveSkillUser(SkillDTO skillDTO, int id) throws UserNotFoundException {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Skill skill = new Skill();
            skill.setName(skillDTO.getName());
            if (skillDTO.getLevel() != null) {
                skill.setLevel(LevelExperience.valueOf(skillDTO.getLevel().toUpperCase()));
            }
            skill.setDescription(skillDTO.getDescription());
            skill.setCertificateBy(skillDTO.getCertificateBy());
            skill.setCertificateDate(skillDTO.getCertificateDate());
            skill.setUser(user);

            skillRepository.save(skill);

            userRepository.save(user);

        } else {
            throw new UserNotFoundException("No user found with id: " + id);
        }
    }


    public List<Skill> getSkillsByUserId(int id) throws UserNotFoundException{
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getSkills();
        } else {
           throw  new UserNotFoundException("No user found with id: " + id);
        }
    }

    public void updateSkill(SkillDTO skillUpdate, int skillId) {
        Optional<Skill> skillOptional = skillRepository.findById(skillId);
        if (skillOptional.isPresent()) {
            Skill skill = skillOptional.get();
            skill.setName(skillUpdate.getName());
            skill.setLevel(LevelExperience.valueOf(skillUpdate.getLevel().toUpperCase()));
            skill.setDescription(skillUpdate.getDescription());
            skill.setCertificateBy(skillUpdate.getCertificateBy());
            skill.setCertificateDate(skillUpdate.getCertificateDate());

            skillRepository.save(skill);
        }
    }

    public void deleteSkill(int id) {
        skillRepository.deleteById(id);
    }
}
