package com.sliit.backend.service;

import com.sliit.backend.User;
import com.sliit.backend.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class OAuth2Service extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        processOAuth2User(userRequest, oauth2User);
        return oauth2User;
    }

    private void processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user's information if needed
            user.setProfilePicture(picture);
            user.setUsername(name);
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setProfilePicture(picture);
            user.setPassword(""); // No password for OAuth users
            user.setUserID(generateUserId()); // You'll need to implement this
        }

        userRepository.save(user);
    }

    private String generateUserId() {
        // Implement your user ID generation logic here
        return "USER_" + System.currentTimeMillis();
    }
} 
