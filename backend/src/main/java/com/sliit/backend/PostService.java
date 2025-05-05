package com.sliit.backend;

//import com.sliit.backend.Post;
//import com.sliit.backend.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
//import com.cloudinary.utils.StringUtils;
//import com.cloudinary.Transformation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
//import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private Cloudinary cloudinary;

    // 1. Create a new post
    public Post createPost(String description, MultipartFile[] mediaFiles) throws IOException {
        List<String> mediaUrls = new ArrayList<>();
        List<String> mediaTypes = new ArrayList<>();
    
        for (MultipartFile file : mediaFiles) {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "resource_type", "auto"
            );
    
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), uploadOptions);
    
            mediaUrls.add(uploadResult.get("secure_url").toString());
            mediaTypes.add(uploadResult.get("resource_type").toString()); // "image" or "video"
        }
    
        Post post = new Post();
        post.setDescription(description);
        post.setMediaUrls(mediaUrls);
        post.setMediaTypes(mediaTypes);
        post.setCreatedAt(System.currentTimeMillis());
    
        return postRepository.save(post);
    }
    
    

    // 2. Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 3. Get a post by ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // 4. Delete a post by ID
    public void deletePostById(String id) {
        postRepository.deleteById(id);
    }

    // 5. Update description and remove media
    public Optional<Post> updatePost(String id, String newDescription) {
        Optional<Post> optionalPost = postRepository.findById(id);
    
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
    
            // Update description
            post.setDescription(newDescription);
    
            // Save the updated post
            postRepository.save(post);
    
            return Optional.of(post);
        } else {
            return Optional.empty();
        }
    
    }

    // 6. Search posts from hashtags
    public List<Post> getPostsByHashtag(String hashtag) {
        String tag = hashtag.toLowerCase();
        return postRepository.findAll().stream()
            .filter(post -> {
                String desc = post.getDescription();
                return desc != null &&
                       (desc.toLowerCase().contains("#" + tag) ||
                        desc.toLowerCase().contains(tag));
            })
            .collect(Collectors.toList());
    }
    

}

