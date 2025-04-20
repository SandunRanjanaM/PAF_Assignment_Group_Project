package com.sliit.backend;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="comments")
public class comment {

    @Id
    private String id;
    private String postId;
    private String userId;
    private String commentText;
    private Date timestamp;

    public comment() {}

    public comment(String commentText, String id, String postId, Date timestamp, String userId) {
        this.commentText = commentText;
        this.id = id;
        this.postId = postId;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

   

}
