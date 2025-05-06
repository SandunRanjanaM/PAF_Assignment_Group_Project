package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/LearningPlan")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan savedPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        List<LearningPlan> plans = learningPlanService.getAllLearningPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanService.getLearningPlanById(id);
        return plan.map(ResponseEntity::ok)
               .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{userId}/{progressName}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansByUserIdAndProgressName(@PathVariable String userId, @PathVariable String progressName) {
        List<LearningPlan> plans = learningPlanService.getLearningPlansByUserIdAndProgressName(userId, progressName);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/latest/{userId}/{progressName}")
    public ResponseEntity<LearningPlan> getLatestPlan(@PathVariable String userId, @PathVariable String progressName) {
    Optional<LearningPlan> latest = learningPlanService.getLatestLearningPlan(userId, progressName);
    return latest.map(ResponseEntity::ok)
                 .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable String id, @RequestBody LearningPlan updatedLearningPlan) {
        Optional<LearningPlan> result = learningPlanService.updateLearningPlan(id, updatedLearningPlan);
        return result.map(plan -> new ResponseEntity<>(plan, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/updateIsCompleted/{progressName}")
    public ResponseEntity<Void> updateIsCompletedForLearningPlans(@PathVariable String progressName) {
        learningPlanService.updateIsCompletedForLearningPlans(progressName);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        boolean deleted = learningPlanService.deleteLearningPlanById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        }
    }
}
