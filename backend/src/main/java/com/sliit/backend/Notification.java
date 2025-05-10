package com.sliit.backend;
 
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
 
@Document(collection = "notification")
public class Notification {
 
    @Id
    private String id;
    private String receiverUserId;
    private String senderUserId;
    private String postId;
    private String message;
    private long timestamp;
    private boolean isRead;
 
    public Notification() {
        this.isRead = false; // Default to unread
        this.timestamp = System.currentTimeMillis(); // Default to current time
    }
 
    // Full constructor
    public Notification(String id, String message, String postId, String receiverUserId, String senderUserId, long timestamp) {
        this.id = id;
        this.message = message;
        this.postId = postId;
        this.receiverUserId = receiverUserId;
        this.senderUserId = senderUserId;
        this.timestamp = timestamp;
        this.isRead = false; // Default to unread
    }
 
    // Constructor without id and timestamp (they will be auto-generated)
    public Notification(String message, String postId, String receiverUserId, String senderUserId) {
        this.message = message;
        this.postId = postId;
        this.receiverUserId = receiverUserId;
        this.senderUserId = senderUserId;
        this.timestamp = System.currentTimeMillis(); // auto timestamp
        this.isRead = false; // Default to unread
    }
 
    // Getters and setters
    public String getId() {
        return id;
    }
 
    public void setId(String id) {
        this.id = id;
    }
 
    public String getReceiverUserId() {
        return receiverUserId;
    }
 
    public void setReceiverUserId(String receiverUserId) {
        this.receiverUserId = receiverUserId;
    }
 
    public String getSenderUserId() {
        return senderUserId;
    }
 
    public void setSenderUserId(String senderUserId) {
        this.senderUserId = senderUserId;
    }
 
    public String getPostId() {
        return postId;
    }
 
    public void setPostId(String postId) {
        this.postId = postId;
    }
 
    public String getMessage() {
        return message;
    }
 
    public void setMessage(String message) {
        this.message = message;
    }
 
    public long getTimestamp() {
        return timestamp;
    }
 
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
 
    public boolean isRead() {
        return isRead;
    }
 
    public void setRead(boolean read) {
        isRead = read;
    }
}