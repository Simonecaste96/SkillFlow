package it.skillflow.Controller;

import it.skillflow.DTO.PostDTO;
import it.skillflow.DTO.UserDTO;
import it.skillflow.Exception.BadRequestException;
import it.skillflow.Repository.UserRepository;
import it.skillflow.Services.PostService;
import it.skillflow.Services.UserService;
import it.skillflow.entity.Post;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/skill_flow")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/user-interests/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<String> getUserInterests(@PathVariable int userId) {
        return userService.findInterestByUserId(userId);
    }


    @PutMapping("/status/{userId}/{isOnline}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void updateUserOnlineStatus(@PathVariable int userId, @PathVariable boolean isOnline) {
        userService.updateUserOnlineStatus(userId, isOnline);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<User> searchUsers(@RequestParam String name, @RequestParam String surname) {
        return userService.findUsersByQuery(name, surname);
    }
    



    @GetMapping("/usersPage")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Page<User> getUsers(@RequestParam(defaultValue = "1") int page,
                               @RequestParam(defaultValue = "15") int size,
                               @RequestParam(defaultValue = "id") String sortBy){ // sarebbe piu sensato fare per name didefault? ?
        return userService.getUserConPaginazione(page,size,sortBy);
    }


    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<User> getUsersList(){
        return userService.getUsers();
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Optional<User> getUser(@PathVariable int id){
        return userService.getUserById(id);
    }



    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public User updateUser(@PathVariable int id, @RequestBody @Validated UserDTO userDTO, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return userService.updateUser(userDTO, id);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public String deleteUser( @PathVariable int id){
        return userService.deleteUser(id);
    }


}
