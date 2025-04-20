package com.sliit.backend;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "LearningPlans")
@Getter
@Setter
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String progressName;
    private Date createdAt;
    private Date updatedAt;
    private String title;
    private String description;
    private List<String> steps;
    private int durationValue;        
    private String durationUnit; 
    private String priority;    
    private boolean isCompleted;
}
