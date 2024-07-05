package it.skillflow.entity;

import com.fasterxml.jackson.annotation.*;
import it.skillflow.Enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import java.util.Set;

@Data
@Entity
@Table(name = "users")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String email;
    @JsonIgnore
    private String password;

    private String pictureProfile;


    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> interests;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Skill> skills;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Post> posts;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FriendRequest> sentFriendRequests;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FriendRequest> receivedFriendRequests;

    //fai end point per prednere richeiste di amicizia ricevute

    @ManyToMany
    @JoinTable(
            name = "friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnore
    private List<User> friends;


    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ChatRoom> sentChats;



    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Chat> senderMessages;



    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Chat> recipientMessages;


    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ChatRoom> receivedChats;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private Role role;


    @OneToMany(mappedBy = "reviewer")
    @JsonIgnore
    private List<Review> reviews;


    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SkillExchangeRequest> initiatedSkillExchanges;


    @OneToMany(mappedBy = "responder", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SkillExchangeRequest> receivedSkillExchanges;



//da sistemare non va bene
    @Column(nullable = false)
    private boolean isOnline;


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }


}

