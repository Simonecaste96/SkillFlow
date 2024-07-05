package it.skillflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Post {
    @Id
    @GeneratedValue
    private int id;



    private String author;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private int likes;


    private String resourceUrls;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIncludeProperties("pictureProfile")
    private User user;

    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", userId=" + (user != null ? user.getId() : null) +
                '}';
    }
}
