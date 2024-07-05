package it.skillflow.Controller;

import it.skillflow.DTO.PostDTO;
import it.skillflow.Services.PostService;
import it.skillflow.entity.Post;
import org.apache.coyote.BadRequestException;
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

@RestController
@RequestMapping("/skill_flow")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PutMapping("like/{postId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Integer toggleLike(@PathVariable int postId, @RequestParam boolean like) {
        int likesCount;
        if (like) {
            likesCount = postService.addLike(postId);
        } else {
            likesCount = postService.removeLike(postId);
        }
        return likesCount;
    }


    @GetMapping("/users/postsPage")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public Page<Post> getPosts(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "15") int size,
                               @RequestParam(defaultValue = "createdDate") String sortBy) {
        return postService.getPostConPaginazione(page, size, sortBy);
    }

    @GetMapping("/users/posts")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public List<Post> getPostsList(){
        return postService.getPosts();
    }


    @GetMapping("/users/{id}/posts")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER', 'ADMIN')")
    public List<Post> getPostsList(@PathVariable int id) throws BadRequestException {
        return postService.getPostsByUserId(id);
    }



    @PostMapping("/users/post/{userId}")
    @PreAuthorize("hasAnyAuthority('NORMAL_USER','ADMIN')")
    public void createPost(@PathVariable int userId, @RequestPart("postDTO") @Validated PostDTO postDTO,
                                             @RequestPart(value="file", required = false) MultipartFile file,
                                             BindingResult bindingResult) throws IOException {
        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Richiesta non valida: " + bindingResult.getAllErrors().stream().map(e -> e.getDefaultMessage()).reduce("", (s1, s2) -> s1 + "\n" + s2));
        }

       postService.createPost(postDTO, file, userId);
    }
}
