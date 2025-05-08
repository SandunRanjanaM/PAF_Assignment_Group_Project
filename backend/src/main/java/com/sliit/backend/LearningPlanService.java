package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
    private final LearningProgressRepository learningProgressRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository,
                               LearningProgressRepository learningProgressRepository) {
        this.learningPlanRepository = learningPlanRepository;
        this.learningProgressRepository = learningProgressRepository;
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        learningPlan.setCreatedAt(new Date());
        learningPlan.setUpdatedAt(new Date());
        updateTaskCompletionStatuses(learningPlan);
        return learningPlanRepository.save(learningPlan);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public Optional<LearningPlan> getLatestLearningPlan(String userId, String progressName) {
        List<LearningPlan> plans = learningPlanRepository.findByUserIdAndProgressName(userId, progressName);
        return plans.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .findFirst();
    }

    public List<LearningPlan> getLearningPlansByUserIdAndProgressName(String userId, String progressName) {
        return learningPlanRepository.findByUserIdAndProgressName(userId, progressName);
    }

    public Optional<LearningPlan> updateLearningPlan(String id, LearningPlan updatedLearningPlan) {
        return learningPlanRepository.findById(id).map(existingPlan -> {
            existingPlan.setTitle(updatedLearningPlan.getTitle());
            existingPlan.setDescription(updatedLearningPlan.getDescription());
            existingPlan.setDurationValue(updatedLearningPlan.getDurationValue());
            existingPlan.setDurationUnit(updatedLearningPlan.getDurationUnit());
            existingPlan.setPriority(updatedLearningPlan.getPriority());
            existingPlan.setCompleted(updatedLearningPlan.isCompleted());
            existingPlan.setUpdatedAt(new Date());

            // ✅ Replace entire task list directly
            existingPlan.setTasks(updatedLearningPlan.getTasks());

            // ✅ Update completion status based on steps
            updateTaskCompletionStatuses(existingPlan);

            return learningPlanRepository.save(existingPlan);
        });
    }

    public void updateIsCompletedForLearningPlans(String progressName) {
        List<LearningProgress> progressList = learningProgressRepository.findByProgressNameOrderByCreatedAtDesc(progressName);
        if (!progressList.isEmpty()) {
            LearningProgress latestProgress = progressList.get(0);
            boolean isCompleted = latestProgress.getProgressPercentage() == 100;

            List<LearningPlan> plans = learningPlanRepository.findByUserIdAndProgressName(latestProgress.getUserId(), progressName);
            for (LearningPlan plan : plans) {
                plan.setCompleted(isCompleted);
                learningPlanRepository.save(plan);
            }
        }
    }

    public boolean deleteLearningPlanById(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    private void updateTaskCompletionStatuses(LearningPlan plan) {
        if (plan.getTasks() != null) {
            for (LearningPlan.Task task : plan.getTasks()) {
                if (task.getSteps() != null && !task.getSteps().isEmpty()) {
                    boolean allChecked = task.getSteps().stream().allMatch(LearningPlan.Step::isChecked);
                    task.setCompleted(allChecked);
                } else {
                    task.setCompleted(false);
                }
            }
        }
    }
}
