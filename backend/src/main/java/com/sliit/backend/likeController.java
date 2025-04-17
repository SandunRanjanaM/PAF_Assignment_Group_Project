package com.sliit.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class likeController {

    @Autowired
    private likeService likeService;



    // Get likes by post ID
    @GetMapping("/{postId}")
    public ResponseEntity<List<like>> getLikesByPostId(@PathVariable String postId) {
        List<like> likes = likeService.getLikesByPostId(postId);
        return new ResponseEntity<>(likes, HttpStatus.OK);
    }

    //like count
    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getLikeCountByPostId(@PathVariable String postId) {
    long likeCount = likeService.getLikeCountByPostId(postId);
    return new ResponseEntity<>(likeCount, HttpStatus.OK);
}

    // Create a new like
    @PostMapping
    public ResponseEntity<like> createLike(@RequestBody like like) {
        like savedLike = likeService.createLike(like);
        return new ResponseEntity<>(savedLike, HttpStatus.CREATED);
    }

    // Delete a like by ID
    @DeleteMapping("/{likeId}")
    public ResponseEntity<Void> deleteLike(@PathVariable String likeId) {
        boolean deleted = likeService.deleteLike(likeId);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                       : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
