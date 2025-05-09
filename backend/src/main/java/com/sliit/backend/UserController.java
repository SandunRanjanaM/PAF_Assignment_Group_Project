package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sliit.backend.dto.LoginRequest;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService service;
    


    @Autowired
    private ImageUploadService imageUploadService;

    // GET all users
    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(service.findAllUsers(), HttpStatus.OK);
    }

    // GET single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSingleUser(@PathVariable String id) {
        Optional<User> user = service.findUserById(id);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // CREATE user with profile picture upload
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<User> createUser(
            @RequestPart("user") String userString,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userString, User.class);

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String imageUrl = imageUploadService.uploadImage(profilePicture);
                user.setProfilePicture(imageUrl);
            }

            return new ResponseEntity<>(service.createUser(user), HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedData) {
        Optional<User> optionalUser = service.findUserById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User updatedUser = service.updateUser(id, updatedData);
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        service.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // LOGIN user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = service.findUserByEmail(loginRequest.getEmail());

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/{followerId}/follow/{followeeId}")
    public ResponseEntity<?> followUser(@PathVariable String followerId, @PathVariable String followeeId) {
        boolean success = service.followUser(followerId, followeeId);
        if (success) {
            return ResponseEntity.ok("Followed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Follow action failed");
        }
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String id) {
        Optional<User> userOpt = service.findUserById(id);
        if (userOpt.isPresent()) {
            List<String> followerIds = userOpt.get().getFollowers();
            List<User> followers = service.findUsersByIds(followerIds);
            return ResponseEntity.ok(followers);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable String id) {
        Optional<User> userOpt = service.findUserById(id);
        if (userOpt.isPresent()) {
            List<String> followingIds = userOpt.get().getFollowing();
            List<User> following = service.findUsersByIds(followingIds);
            return ResponseEntity.ok(following);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}/skills")
    public ResponseEntity<?> updatePreferredSkills(
            @PathVariable String id,
            @RequestBody List<String> skills) {

        Optional<User> userOpt = service.findUserById(id);
        if (userOpt.isPresent()) {
            User updatedUser = service.updatePreferredSkills(id, skills);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

      
        
    }

    @GetMapping("/{id}/suggested")
    public ResponseEntity<List<User>> suggestUsersBySkills(@PathVariable String id) {
        List<User> suggestions = service.suggestUsersBySkills(id);
        return ResponseEntity.ok(suggestions);
    }





    

}
