package com.sliit.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sliit.backend.models.LearningProgress;

import java.util.List;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
}
