package com.sliit.backend;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class commentcontroller {

    @Autowired
    private commentService commentService;

    // POST: Create a new Comment
    @PostMapping
    public comment createComment(@RequestBody comment newComment) {
        newComment.setTimestamp(new Date()); //Automatically set the timestamp
        return commentService.createComment(newComment);
    }

    // GET: Retrieve all Comments
    @GetMapping
    public List<comment> getAllComments() {
        return commentService.getAllComments();
    }

    // GET: Retrieve a Comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<comment> getCommentById(@PathVariable String id) {
        Optional<comment> commentOpt = commentService.getCommentById(id);
        return commentOpt.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT: Update a Comment by ID
    @PutMapping("/{id}")
    public ResponseEntity<comment> updateComment(@PathVariable String id, @RequestBody comment commentDetails) {
        Optional<comment> updatedComment = commentService.updateComment(id, commentDetails);
        return updatedComment.map(ResponseEntity::ok)
                             .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE: Delete a Comment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        boolean deleted = commentService.deleteComment(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // GET: Get Comments by Post ID
    @GetMapping("/post/{postId}")
    public List<comment> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }
}
