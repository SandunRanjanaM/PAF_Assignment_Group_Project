package com.sliit.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="likes")
public class like {

    @Id
    private String id;
    private String postId;
    private String userId;


    public like(){}

    public like(String id, String postId, String userId) {
        this.id = id;
        this.postId = postId;
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
    
}
