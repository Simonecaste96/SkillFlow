package it.skillflow.Controller;

import it.skillflow.DTO.UserDTO;
import it.skillflow.DTO.UserLoginDTO;
import it.skillflow.Exception.BadRequestException;
import it.skillflow.Security.AuthenticationResponse;
import it.skillflow.Services.AuthService;
import it.skillflow.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserService userService;
    @Autowired
    AuthService authService;


    @PostMapping(value = "/signup", consumes = "multipart/form-data")
    @CrossOrigin(origins = "*")
    public void signup(@RequestPart("userDTO") @Validated UserDTO userDTO, @RequestPart(value="foto",required = false) MultipartFile foto, BindingResult bindingResult) throws IOException {
        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).reduce("",(s, s2) -> s+s2 ));
        }

         userService.saveUser(userDTO,foto);


    }



    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public AuthenticationResponse login(@RequestBody @Validated UserLoginDTO userLoginDTO, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).reduce("",(s, s2) -> s+s2 ));
        }

        return authService.authenticateUserAndCreateToken(userLoginDTO);
    }


}
