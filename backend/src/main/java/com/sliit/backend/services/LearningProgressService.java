package com.sliit.backend.services;

import com.sliit.backend.models.LearningProgress;
import com.sliit.backend.repositories.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return learningProgressRepository.save(learningProgress);
    }

    public List<LearningProgress> getAllLearningProgress() {
        return learningProgressRepository.findAll();
    }

    public List<LearningProgress> getLearningProgressByUserId(String userId) {
        return learningProgressRepository.findByUserId(userId);
    }

    public Optional<LearningProgress> updateLearningProgress(String id, LearningProgress updatedLearningProgress) {
        return learningProgressRepository.findById(id).map(existing -> {
            existing.setUserId(updatedLearningProgress.getUserId());
            existing.setNewSkills(updatedLearningProgress.getNewSkills());
            existing.setTitle(updatedLearningProgress.getTitle());
            existing.setDescription(updatedLearningProgress.getDescription());
            existing.setTutorials(updatedLearningProgress.getTutorials());
            return learningProgressRepository.save(existing);
        });
    }

    public void deleteLearningProgress(String id) {
        learningProgressRepository.deleteById(id);
    }

    public Optional<LearningProgress> getLearningProgressById(String id) {
        return learningProgressRepository.findById(id);
    }
}
