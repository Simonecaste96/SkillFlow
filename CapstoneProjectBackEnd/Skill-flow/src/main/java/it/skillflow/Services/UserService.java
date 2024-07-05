package it.skillflow.Services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import it.skillflow.DTO.SkillDTO;
import it.skillflow.DTO.UserDTO;
import it.skillflow.Enums.LevelExperience;
import it.skillflow.Enums.Role;
import it.skillflow.Exception.BadRequestException;
import it.skillflow.Exception.NotFoundException;
import it.skillflow.Exception.UserNotFoundException;
import it.skillflow.Repository.SkillRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.Security.JwtTool;
import it.skillflow.entity.Skill;
import it.skillflow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private JavaMailSenderImpl javaMailSenderImpl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTool jwtTool;

//metood per aggiornare lo stato al login
public void updateUserOnlineStatus(int userId, boolean isOnline) {
    Optional<User> optionalUser = userRepository.findById(userId);
    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        user.setOnline(isOnline);
        userRepository.save(user);
        System.out.println("User status updated to " + (isOnline ? "online" : "offline") + " for user ID: " + userId);
    } else {
        System.out.println("User not found with ID: " + userId);
    }
}

public List<String> findInterestByUserId(int userId) {
    return userRepository.findInterestsById(userId);
}

//query per la barra di ricerca
    public List<User> findUsersByQuery(String name, String surname) {
        return userRepository.findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(name, surname);
    }

    public User getUserByUsername(String username){
        Optional<User> userOptional =  userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            return userOptional.get();
        }else{
            throw new NotFoundException("User with username: "+username+" not found");
        }
    }

    public User getUserByEmail(String email){
        Optional<User> userOptional =  userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get();
        }else{
            throw new NotFoundException("User with email: "+email+" not found");
        }
    }

    public Optional<User> getUserById(int id){
        Optional<User> userOptional =  userRepository.findById(id);
        if(userOptional.isPresent()){
            return userRepository.findById(id);
        }
        else{
            throw new NotFoundException("User with id: "+id+" not found");
        }
    }


    public Page<User> getUserConPaginazione(int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page,size, Sort.by(sortBy));
        return  userRepository.findAll(pageable);
    }
    public List<User> getUsers(){
        return  userRepository.findAll();
    }



    public void saveUser(UserDTO userDTO, MultipartFile foto) throws IOException {


        Optional<User> userOptional =  userRepository.findByEmail(userDTO.getEmail());

        if(userOptional.isPresent()){
            throw new BadRequestException("This email is already associated with an account!");

        }else{
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setName(userDTO.getName());
            user.setSurname(userDTO.getSurname());




            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setDateOfBirth(userDTO.getDateOfBirth());
            user.setInterests(userDTO.getInterests()); // VALUTA SE MODIFICARE TIPO
            user.setRole(Role.NORMAL_USER);


            userRepository.save(user);

            if (foto != null) {
                patchPictureProfileUser(user.getId(), foto);
                userRepository.save(user);
            } else {
                user.setPictureProfile("https://ui-avatars.com/api/?name="+userDTO.getName()+"+"+userDTO.getSurname());
                userRepository.save(user);
            }

            sendMailCreazioneProfilo(user.getEmail());

        }

    }






    public User updateUser(UserDTO userUpdate, int id) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setUsername(userUpdate.getUsername());
            user.setName(userUpdate.getName());
            user.setSurname(userUpdate.getSurname());
            user.setEmail(userUpdate.getEmail());
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
            return userRepository.save(user);
        } else {
            throw new UserNotFoundException("No user found with id: " + id);
        }
    }


    public User updateUserParse(int id, Map<String, Object> update) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            update.forEach((key, value) -> {
                switch (key) {
                    case "username":
                        user.setUsername((String) value);
                        break;
                    case "name":
                        user.setName((String) value);
                        break;
                    case "surname":
                        user.setSurname((String) value);
                        break;
                    case "email":
                        user.setEmail((String) value);
                        break;
                    case "pictureProfile":
                        user.setPictureProfile((String) value);
                        break;
                    case "password":
                        user.setPassword(passwordEncoder.encode((CharSequence) value));
                        sendMailModificaPassword(user.getEmail());
                    default:
                        throw new IllegalArgumentException("Campo non valido: " + key);
                }
            });

            userRepository.save(user);

            return user;
        } else {
            throw new UserNotFoundException("No user found with id: " + id);
        }
    }



    public String deleteUser(int id) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);

        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return "User with id: "+ id + " has been deleted from the database";
        } else {
            throw new UserNotFoundException("No user found with id: " + id);
        }


    }



    public String patchPictureProfileUser(int id, MultipartFile foto) throws UserNotFoundException, IOException {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()){
            String url =(String) cloudinary.uploader().upload(foto.getBytes(), Collections.emptyMap()).get("url");
            User user = userOptional.get();
            user.setPictureProfile(url);
            userRepository.save(user);
            return "Profile picture updated!";
        }else{
            throw new UserNotFoundException("No user found with id: " + id);
        }
    }




    private void sendMailCreazioneProfilo(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Account created successfully");
        message.setText("You can now access the system");

        javaMailSenderImpl.send(message);
    }


    private void sendMailModificaPassword(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password change request");
        message.setText("Your password has been changed. If this was not you, please report it!");

        javaMailSenderImpl.send(message);
    }


}
