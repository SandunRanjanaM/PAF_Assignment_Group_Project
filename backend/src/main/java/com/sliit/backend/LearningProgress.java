package com.sliit.backend;

import java.util.Date;
import java.util.List;
import java.util.Map;
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
    private String progressName;
    private String newSkills;
    private String title;
    private String description;
    private String resources;
    private int progressPercentage;
    private Date createdAt;
    private List<Map<String, Object>> tasks;

    public void calculateProgressPercentage() {
        if (tasks == null || tasks.isEmpty()) {
            this.progressPercentage = 0;
        } else {
            long completedCount = tasks.stream()
                .filter(task -> Boolean.TRUE.equals(task.get("completed")))
                .count();
            this.progressPercentage = (int) Math.round((double) completedCount / tasks.size() * 100);
        }
    }
}
