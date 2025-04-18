package com.sliit.backend;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public List<User> findAllUsers() {
        return repository.findAll();
    }

    public Optional<User> findUserById(String userID) {
        return repository.findById(userID);
    }

    public User createUser(User user) {
        return repository.save(user);
    }

    public User updateUser(String id, User userData) {
        return repository.findById(id).map(existingUser -> {
            existingUser.setUsername(userData.getUsername());
            existingUser.setEmail(userData.getEmail());
            existingUser.setPassword(userData.getPassword());
            existingUser.setBio(userData.getBio());
            existingUser.setProfilePicture(userData.getProfilePicture());
            existingUser.setFollowers(userData.getFollowers());
            existingUser.setFollowing(userData.getFollowing());
            return repository.save(existingUser);
        }).orElse(null);
    }

    // DELETE
    public void deleteUser(String userID) {
        repository.deleteById(new ObjectId(userID));
    }
}
