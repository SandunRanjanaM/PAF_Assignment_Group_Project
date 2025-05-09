package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class LearningProgressService {

    private final LearningProgressRepository learningProgressRepository;
    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningProgressService(LearningProgressRepository learningProgressRepository,
                                 LearningPlanService learningPlanService) {
        this.learningProgressRepository = learningProgressRepository;
        this.learningPlanService = learningPlanService;
    }

    public LearningProgress createLearningProgress(LearningProgress learningProgress) {

        learningProgress.calculateProgressPercentage();
        learningProgress.setCreatedAt(new Date());
        LearningProgress savedProgress = learningProgressRepository.save(learningProgress);

        // Check if there's an existing plan for this progress
        List<LearningPlan> plans = learningPlanService.getLearningPlansByUserIdAndProgressName(
            learningProgress.getUserId(),
            learningProgress.getProgressName()
        );

        if (!plans.isEmpty()) {
            // Get the latest plan
            LearningPlan latestPlan = plans.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .findFirst()
                .orElse(null);

            if (latestPlan != null) {
                // Update the plan's tasks to match the new progress tasks
                List<LearningPlan.Task> updatedTasks = learningProgress.getTasks().stream()
                    .map(task -> {
                        LearningPlan.Task planTask = new LearningPlan.Task();
                        planTask.setTitle((String) task.get("title"));
                        planTask.setCompleted((Boolean) task.get("completed"));
                        // Preserve existing steps if any
                        if (latestPlan.getTasks() != null) {
                            latestPlan.getTasks().stream()
                                .filter(t -> t.getTitle().equals(task.get("title")))
                                .findFirst()
                                .ifPresent(t -> planTask.setSteps(t.getSteps()));
                        }
                        if (planTask.getSteps() == null) {
                            planTask.setSteps(new ArrayList<>());
                        }
                        return planTask;
                    })
                    .collect(Collectors.toList());

                latestPlan.setTasks(updatedTasks);
                learningPlanService.updateLearningPlan(latestPlan.getId(), latestPlan);
            }
        }

        return savedProgress;
    }

    public List<LearningProgress> getAllLearningProgress() {
        return learningProgressRepository.findAll();
    }

    public List<LearningProgress> getLearningProgressByUserId(String userId) {
        return learningProgressRepository.findByUserId(userId);
    }

    public List<LearningProgress> getLearningProgressByUserIdAndProgressName(String userId, String progressName) {
        return learningProgressRepository.findByUserIdAndProgressName(userId, progressName);
    }    

    public Optional<LearningProgress> updateLearningProgress(String id, LearningProgress updatedLearningProgress) {
        return learningProgressRepository.findById(id).map(existing -> {

            existing.setUserId(updatedLearningProgress.getUserId());
            existing.setProgressName(updatedLearningProgress.getProgressName());
            existing.setNewSkills(updatedLearningProgress.getNewSkills());
            existing.setTitle(updatedLearningProgress.getTitle());
            existing.setDescription(updatedLearningProgress.getDescription());
            existing.setResources(updatedLearningProgress.getResources());
            existing.setTasks(updatedLearningProgress.getTasks());

            updatedLearningProgress.calculateProgressPercentage();
            existing.setProgressPercentage(updatedLearningProgress.getProgressPercentage());

            // Save the updated progress
            LearningProgress savedProgress = learningProgressRepository.save(existing);

            // Update the corresponding plan's tasks
            List<LearningPlan> plans = learningPlanService.getLearningPlansByUserIdAndProgressName(
                existing.getUserId(), 
                existing.getProgressName()
            );

            if (!plans.isEmpty()) {
                // Get the latest plan
                LearningPlan latestPlan = plans.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .findFirst()
                    .orElse(null);

                if (latestPlan != null) {
                    // Remove tasks from plan that are not in progress
                    Set<String> progressTitles = updatedLearningProgress.getTasks().stream()
                        .map(task -> (String) task.get("title"))
                        .collect(Collectors.toSet());

                    List<LearningPlan.Task> filteredExistingTasks = latestPlan.getTasks().stream()
                        .filter(t -> progressTitles.contains(t.getTitle()))
                        .collect(Collectors.toList());

                    // Now build the updated list, preserving steps for matching titles
                    List<LearningPlan.Task> updatedTasks = updatedLearningProgress.getTasks().stream()
                        .map(task -> {
                            LearningPlan.Task planTask = new LearningPlan.Task();
                            planTask.setTitle((String) task.get("title"));
                            planTask.setCompleted((Boolean) task.get("completed"));
                            // Preserve steps if exists
                            filteredExistingTasks.stream()
                                .filter(t -> t.getTitle().equals(task.get("title")))
                                .findFirst()
                                .ifPresent(t -> planTask.setSteps(t.getSteps()));
                            if (planTask.getSteps() == null) {
                                planTask.setSteps(new ArrayList<>());
                            }
                            return planTask;
                        })
                        .collect(Collectors.toList());

                    latestPlan.setTasks(updatedTasks);
                    learningPlanService.updateLearningPlan(latestPlan.getId(), latestPlan);
                }
            }

            return savedProgress;
        });
    }

    public void deleteLearningProgress(String id) {
        Optional<LearningProgress> progress = learningProgressRepository.findById(id);
        if (progress.isPresent()) {
            LearningProgress existingProgress = progress.get();
            // Get the corresponding plan
            List<LearningPlan> plans = learningPlanService.getLearningPlansByUserIdAndProgressName(
                existingProgress.getUserId(),
                existingProgress.getProgressName()
            );

            // Delete the progress
            learningProgressRepository.deleteById(id);

            // Update the plan's tasks if it exists
            if (!plans.isEmpty()) {
                LearningPlan latestPlan = plans.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .findFirst()
                    .orElse(null);

                if (latestPlan != null) {
                    // Remove tasks that were in the deleted progress
                    List<LearningPlan.Task> updatedTasks = latestPlan.getTasks().stream()
                        .filter(task -> existingProgress.getTasks().stream()
                            .noneMatch(pt -> pt.get("title").equals(task.getTitle())))
                        .collect(Collectors.toList());

                    latestPlan.setTasks(updatedTasks);
                    learningPlanService.updateLearningPlan(latestPlan.getId(), latestPlan);
                }
            }
        }
    }

    public Optional<LearningProgress> getLearningProgressById(String id) {
        return learningProgressRepository.findById(id);
    }

    public Optional<LearningProgress> getLatestProgressByUserIdAndProgressName(String userId, String progressName) {
        return learningProgressRepository.findTopByUserIdAndProgressNameOrderByCreatedAtDesc(userId, progressName);
    }
}
