package com.sliit.backend.services;

import com.sliit.backend.models.LearningPlan;
import com.sliit.backend.repositories.LearningPlanRepository;
import com.sliit.backend.models.LearningProgress;
import com.sliit.backend.repositories.LearningProgressRepository;
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
        return learningPlanRepository.save(learningPlan);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }    

    public List<LearningPlan> getLearningPlansByUserIdAndProgressName(String userId, String progressName) {
        return learningPlanRepository.findByUserIdAndProgressName(userId, progressName);
    }

    public Optional<LearningPlan> updateLearningPlan(String id, LearningPlan updatedLearningPlan) {
        return learningPlanRepository.findById(id).map(existingPlan -> {
            existingPlan.setTitle(updatedLearningPlan.getTitle());
            existingPlan.setDescription(updatedLearningPlan.getDescription());
            existingPlan.setSteps(updatedLearningPlan.getSteps());
            existingPlan.setDurationValue(updatedLearningPlan.getDurationValue());
            existingPlan.setDurationUnit(updatedLearningPlan.getDurationUnit());
            existingPlan.setPriority(updatedLearningPlan.getPriority());            
            existingPlan.setCompleted(updatedLearningPlan.isCompleted());
            existingPlan.setUpdatedAt(new Date());
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
}
