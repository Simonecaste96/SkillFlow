package it.skillflow.Services;

import it.skillflow.DTO.UserLoginDTO;
import it.skillflow.Exception.UnauthorizedException;
import it.skillflow.Security.AuthenticationResponse;
import it.skillflow.Security.JwtTool;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthenticationResponse authenticateUserAndCreateToken(UserLoginDTO userLoginDTO){
        User user = userService.getUserByEmail(userLoginDTO.getEmail());

        if (passwordEncoder.matches(userLoginDTO.getPassword() ,user.getPassword())) {

            String token = jwtTool.createToken(user);

            return new AuthenticationResponse(token,user);
        }else{
            throw  new UnauthorizedException("Incorrect data, check the data entered and try again, if you still encounter problems contact support");
        }
    }

}
