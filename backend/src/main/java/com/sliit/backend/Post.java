package com.sliit.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "posts")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class Post {

    @Id
    private String id;
    private String description;
    private List<String> mediaUrls; 
    private List<String> mediaTypes; 
    private long createdAt;
  
}
