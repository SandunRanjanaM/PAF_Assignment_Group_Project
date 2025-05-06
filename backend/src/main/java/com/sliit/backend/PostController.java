package com.sliit.backend;

import com.sliit.backend.Post;
import com.sliit.backend.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/posts") 
public class PostController {

    @Autowired
    private PostService postService;

    // 1. Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam("description") String description,
            @RequestParam("mediaFiles") MultipartFile[] mediaFiles
    ) {
        try {
            Post createdPost = postService.createPost(description, mediaFiles);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2. Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // 3. Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Delete a post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable String id) {
        postService.deletePostById(id);
        return ResponseEntity.noContent().build();
    }

    // 5. Update description of a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
        @PathVariable String id,
        @RequestBody Map<String, String> body
    ) {
        String newDescription = body.get("description");
        Optional<Post> updatedPost = postService.updatePost(id, newDescription);
        return updatedPost.map(post -> new ResponseEntity<>(post, HttpStatus.OK))
                      .orElseGet(() -> ResponseEntity.notFound().build());
}
}
