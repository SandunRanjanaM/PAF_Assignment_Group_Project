package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressService {

    private final LearningProgressRepository learningProgressRepository;

    @Autowired
    public LearningProgressService(LearningProgressRepository learningProgressRepository) {
        this.learningProgressRepository = learningProgressRepository;
    }

    public LearningProgress createLearningProgress(LearningProgress learningProgress) {

        learningProgress.calculateProgressPercentage();
        learningProgress.setCreatedAt(new Date());
        return learningProgressRepository.save(learningProgress);
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

            return learningProgressRepository.save(existing);
        });
    }

    public void deleteLearningProgress(String id) {
        learningProgressRepository.deleteById(id);
    }

    public Optional<LearningProgress> getLearningProgressById(String id) {
        return learningProgressRepository.findById(id);
    }

    public Optional<LearningProgress> getLatestProgressByUserIdAndProgressName(String userId, String progressName) {
        return learningProgressRepository.findTopByUserIdAndProgressNameOrderByCreatedAtDesc(userId, progressName);
    }
}
