package it.skillflow.Security;

import it.skillflow.entity.User;
import lombok.Data;

@Data
public class AuthenticationResponse {

    private String token;


    private User user;

    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
}
