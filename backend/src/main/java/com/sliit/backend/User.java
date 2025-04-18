package com.sliit.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;



import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private ObjectId id;
    private String userID;
    private String username;
    private String email;
    private String password;
    private String bio;
    private String profilePicture;
    @DocumentReference
    private List<User> followers;
    @DocumentReference
    private List<User> following;
   
    

    
    public User(String userID,String username, String email, String password, String bio, String profilePicture) {
        
        this.userID=userID;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.profilePicture = profilePicture;
    }
}

