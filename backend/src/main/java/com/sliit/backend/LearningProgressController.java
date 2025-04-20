package com.sliit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/LearningProgress")
public class LearningProgressController {

    private final LearningProgressService learningProgressService;

    @Autowired
    public LearningProgressController(LearningProgressService learningProgressService) {
        this.learningProgressService = learningProgressService;
    }

    @PostMapping
    public ResponseEntity<LearningProgress> createLearningProgress(@RequestBody LearningProgress learningProgress) {
        
        learningProgress.calculateProgressPercentage();
        LearningProgress saved = learningProgressService.createLearningProgress(learningProgress);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LearningProgress>> getAllLearningProgress() {
        List<LearningProgress> list = learningProgressService.getAllLearningProgress();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<LearningProgress>> getByUserId(@PathVariable String userId) {
        List<LearningProgress> list = learningProgressService.getLearningProgressByUserId(userId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{userId}/{progressName}/latest")
    public ResponseEntity<LearningProgress> getLatestProgressForUser(
            @PathVariable String userId,
            @PathVariable String progressName) {
        Optional<LearningProgress> latestProgress =
                learningProgressService.getLatestProgressByUserIdAndProgressName(userId, progressName);
        return latestProgress.map(ResponseEntity::ok)
                             .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateLearningProgress(@PathVariable String id, @RequestBody LearningProgress updated) {

        updated.calculateProgressPercentage();
        Optional<LearningProgress> result = learningProgressService.updateLearningProgress(id, updated);
        return result.map(progress -> new ResponseEntity<>(progress, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningProgress(@PathVariable String id) {
        learningProgressService.deleteLearningProgress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
