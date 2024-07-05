package it.skillflow.Services;

import com.cloudinary.Cloudinary;
import it.skillflow.DTO.PostDTO;
import it.skillflow.DTO.UserDTO;
import it.skillflow.Exception.UserNotFoundException;
import it.skillflow.Repository.PostRepository;
import it.skillflow.Repository.UserRepository;
import it.skillflow.Security.JwtTool;
import it.skillflow.entity.Post;
import it.skillflow.entity.User;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTool jwtTool;


    public Page<Post> getPostConPaginazione(int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page,size, Sort.by(sortBy));
        return  postRepository.findAll(pageable);
    }
    public List<Post> getPosts(){
        return  postRepository.findAll();
    }

    public List<Post> getPostsByUserId(int id) throws BadRequestException {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()){
            return  postRepository.findByUserId(id);
        }
else{
            throw new BadRequestException("Impossibile trovare i post dell'utente con id: "+id+" riprova tra poco");
        }
    }


    public void createPost(PostDTO postDTO, MultipartFile resourceFile, int userId) throws IOException {
       // Optional<User> userOptional = userRepository.findById(jwtTool.getIdFromToken(jwtTool.getUserToken()));
        Optional<User> userOptional = userRepository.findById(userId);
        if(userOptional.isPresent()){
            User author = userOptional.get();
            Post post = new Post();
            post.setAuthor(author.getName() + " " + author.getSurname());
            post.setContent(postDTO.getContent());
            post.setCreatedDate(LocalDateTime.now());
            post.setLastModifiedDate(LocalDateTime.now());

            if (resourceFile != null && !resourceFile.isEmpty()) {
                String url = (String) cloudinary.uploader().upload(resourceFile.getBytes(), Collections.emptyMap()).get("url");
                post.setResourceUrls(url);
            }

            post.setUser(author);
              postRepository.save(post);
           // return getPosts();
        } else {
            throw new BadRequestException("Impossibile creare il post, riprova più tardi");
        }
    }


    public Post updatePost(PostDTO postUpdate, int id) throws BadRequestException {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setContent(postUpdate.getContent());
            post.setLastModifiedDate(LocalDateTime.now());

            return postRepository.save(post);
        } else {
            throw new BadRequestException("Impossibile modificare il post, riprova più tardi");
        }
    }


        public int addLike(int postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
        return post.getLikes();
        }

    public int removeLike(int postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() -1);
        postRepository.save(post);
        return post.getLikes();
    }



}

