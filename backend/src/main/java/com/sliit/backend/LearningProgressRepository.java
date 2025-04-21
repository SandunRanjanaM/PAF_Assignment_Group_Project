package com.sliit.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    List<LearningProgress> findByProgressNameOrderByCreatedAtDesc(String progressName);
    List<LearningProgress> findByUserIdAndProgressName(String userId, String progressName);
    Optional<LearningProgress> findTopByUserIdAndProgressNameOrderByCreatedAtDesc(String userId, String progressName);
}
