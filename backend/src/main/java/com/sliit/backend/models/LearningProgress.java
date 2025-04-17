package com.sliit.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "LearningProgress")
@Getter
@Setter

public class LearningProgress {
    @Id
    private String id;
    private String userId;
    private String newSkills;
    private String title;
    private String description;
    private String tutorials;
}
