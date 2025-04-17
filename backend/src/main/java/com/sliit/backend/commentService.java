package com.sliit.backend;

import com.sliit.backend.comment;
import com.sliit.backend.commentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class commentService {

    @Autowired
    private commentRepository commentRepository;

    // Create a comment
    public comment createComment(comment newComment) {
        return commentRepository.save(newComment);
    }

    // Get all comments
    public List<comment> getAllComments() {
        return commentRepository.findAll();
    }

    // Get a comment by ID
    public Optional<comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    // Update a comment by ID
    public Optional<comment> updateComment(String id, comment commentDetails) {
        return commentRepository.findById(id).map(existingComment -> {
            existingComment.setCommentText(commentDetails.getCommentText());
            return commentRepository.save(existingComment);
        });
    }

    // Delete a comment by ID
    public boolean deleteComment(String id) {
        return commentRepository.findById(id).map(existingComment -> {
            commentRepository.delete(existingComment);
            return true;
        }).orElse(false);
    }

    // Get comments by post ID
    public List<comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }
}
