package it.skillflow.Security;



import it.skillflow.Exception.NotFoundException;
import it.skillflow.Exception.UnauthorizedException;
import it.skillflow.Services.UserService;
import it.skillflow.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;


@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Error in authorization, token is null or Bearer is null");
        }else{
            String token = authHeader.substring(7);

            jwtTool.verifyToken(token);

            int userIdInsideToken = jwtTool.getIdFromToken(token);

            Optional<User> userOptional = userService.getUserById(userIdInsideToken);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                Authentication authentication = new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }else{
                throw new NotFoundException("User with id: "+userIdInsideToken+" ,not found");
            }

            filterChain.doFilter(request,response);
        }

    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException{
        //return new AntPathMatcher().match("/auth/**",request.getServletPath());
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return pathMatcher.match("/auth/**", request.getServletPath()) ||
                pathMatcher.match("/enum/**", request.getServletPath())||
                pathMatcher.match("/skillFlow/**", request.getServletPath()) ||
                pathMatcher.match("/ws/**", request.getServletPath())||
                pathMatcher.match("/user/**", request.getServletPath());
    }

}
