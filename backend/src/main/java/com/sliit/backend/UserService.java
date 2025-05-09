package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;


    public List<User> findUsersByIds(List<String> ids) {
        return repository.findAllById(ids);
    }
    

    public List<User> findAllUsers() {
        return repository.findAll();
    }

    public Optional<User> findUserById(String id) {
        return repository.findById(id);
    }

    public User createUser(User user) {
        return repository.save(user);
    }

    public User updateUser(String id, User userData) {
        return repository.findById(id).map(existingUser -> {
            if (userData.getUsername() != null)
                existingUser.setUsername(userData.getUsername());

            if (userData.getEmail() != null)
                existingUser.setEmail(userData.getEmail());

            if (userData.getPassword() != null)
                existingUser.setPassword(userData.getPassword());

            if (userData.getBio() != null)
                existingUser.setBio(userData.getBio());

            if (userData.getProfilePicture() != null)
                existingUser.setProfilePicture(userData.getProfilePicture());

            // Do NOT update followers/following here
            return repository.save(existingUser);
        }).orElse(null);
    }

    public void deleteUser(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
    

    public User findUserByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public boolean followUser(String followerId, String followeeId) {
        Optional<User> followerOpt = repository.findById(followerId);
        Optional<User> followeeOpt = repository.findById(followeeId);

        if (followerOpt.isPresent() && followeeOpt.isPresent()) {
            User follower = followerOpt.get();
            User followee = followeeOpt.get();

            if (!follower.getFollowing().contains(followeeId)) {
                follower.getFollowing().add(followeeId);
                followee.getFollowers().add(followerId);
                repository.save(follower);
                repository.save(followee);
                return true;
            }
        }

        return false;
    }

    public User updatePreferredSkills(String id, List<String> skills) {
        return repository.findById(id).map(user -> {
            user.setPreferredSkills(skills);
            return repository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> suggestUsersBySkills(String userId) {
        Optional<User> currentUserOpt = repository.findById(userId);
        if (currentUserOpt.isEmpty()) return List.of();
    
        User currentUser = currentUserOpt.get();
        List<String> currentSkills = currentUser.getPreferredSkills();
    
        if (currentSkills == null || currentSkills.isEmpty()) return List.of();
    
        return repository.findAll().stream()
                .filter(u -> !u.getId().equals(userId)) // Exclude self
                .filter(u -> u.getPreferredSkills() != null &&
                             u.getPreferredSkills().stream().anyMatch(currentSkills::contains))
                .toList();
    }
    
    
}
