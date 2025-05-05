package com.sliit.backend;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserIdAndProgressName(String userId, String progressName);
}
