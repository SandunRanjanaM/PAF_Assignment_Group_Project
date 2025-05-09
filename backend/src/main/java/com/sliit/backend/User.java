package com.sliit.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String id;

    private String userID;
    private String username;
    private String email;
    private String password;
    private String bio;
    private String profilePicture;

    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();
    private List<String> preferredSkills = new ArrayList<>();

    
    //private String authProvider;

    public User(String userID, String username, String email, String password, String bio, String profilePicture, String authProvider) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.profilePicture = profilePicture;
       // this.authProvider = authProvider;
    }
}
