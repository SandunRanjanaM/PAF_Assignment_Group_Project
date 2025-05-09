package com.sliit.backend;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Objects;

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
    private List<Task> tasks;
    private int durationValue;
    private String durationUnit;
    private String priority;
    private boolean isCompleted;

    @Getter
    @Setter
    public static class Task {
        private String title;
        private boolean completed;
        private List<Step> steps;

        // Needed for .contains(), .removeIf(), etc.
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Task)) return false;
            Task task = (Task) o;
            return Objects.equals(title, task.title);
        }

        @Override
        public int hashCode() {
            return Objects.hash(title);
        }
    }

    @Getter
    @Setter
    public static class Step {
        private String name;
        private boolean checked;

        public Step(String name, boolean checked) {
            this.name = name;
            this.checked = checked;
        }

        public void toggleChecked() {
            this.checked = !this.checked;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Step)) return false;
            Step step = (Step) o;
            return Objects.equals(name, step.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
    }
}
