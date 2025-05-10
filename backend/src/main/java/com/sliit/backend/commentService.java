package com.sliit.backend;
 
import java.util.Date;
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
 
@Service
public class commentService {
 
    @Autowired
    private notificationService notificationService;
   
    @Autowired
    private commentRepository commentRepository;
 
    @Autowired
    private MongoTemplate mongoTemplate;
 
    public comment createComment(comment newComment) {
        newComment.setTimestamp(new Date());
        comment savedComment = commentRepository.save(newComment);
   
        // Update the Post document to add comment ID
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("_id").is(newComment.getPostId())),
            new Update().push("commentIds", savedComment.getId()),
            "posts"
        );
   
        // Create notification using the notification service
        String notificationMessage = "New comment on post: " + newComment.getCommentText();
        notificationService.createNotification(
            notificationMessage,
            newComment.getPostId(),
            "12345", // Fixed receiver ID as requested
            newComment.getUserId()
        );
       
        return savedComment;
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