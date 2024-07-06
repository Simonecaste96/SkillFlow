package it.skillflow.Repository;

import it.skillflow.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Integer> {

    List<Skill> findByUserId(int userId);
}