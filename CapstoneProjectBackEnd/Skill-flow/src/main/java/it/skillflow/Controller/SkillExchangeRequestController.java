package it.skillflow.Controller;

import it.skillflow.DTO.SkillExchangeRequestDTO;
import it.skillflow.Services.SkillExchangeRequestService;
import it.skillflow.entity.SkillExchangeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skill_flow")
public class SkillExchangeRequestController {

    @Autowired
   private  SkillExchangeRequestService skillExchangeRequestService;

    @PostMapping("/skill_exchange_request/create")
    public void createRequest(@RequestBody SkillExchangeRequestDTO requestDTO, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new RuntimeException("Invalid Request");
        }
         skillExchangeRequestService.createSkillExchangeRequest(requestDTO);
    }



    @GetMapping("/skill_exchange_request/{responderId}")
    public List<SkillExchangeRequest> getRequest(@PathVariable int responderId) {
       return  skillExchangeRequestService.getRequestByResponder(responderId);
    }



    @PutMapping("/skill_exchange_request/response/{requestId}")
    public void handleRequest(@PathVariable int requestId, @RequestParam boolean isAccepted) {
        skillExchangeRequestService.acceptRequest(requestId, isAccepted);
    }





}
