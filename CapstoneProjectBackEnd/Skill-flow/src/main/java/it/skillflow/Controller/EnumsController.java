package it.skillflow.Controller;

import it.skillflow.Enums.InterestType;
import it.skillflow.Enums.LevelExperience;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enum")
public class EnumsController {


    @GetMapping("/interests")
    public List<String> getInterests() {
        return Arrays.stream(InterestType.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/level")
    public List<String> getLevelExperience() {
        return Arrays.stream(LevelExperience.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    }
