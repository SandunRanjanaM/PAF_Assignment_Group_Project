package com.sliit.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class likeService {

    @Autowired
    private likeRepository likeRepository;

    // Create a like
    public like createLike(like newLike) {
        return likeRepository.save(newLike);
    }

    // Get likes by post ID
    public List<like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    // Get like count by post ID
    public long getLikeCountByPostId(String postId) {
        return likeRepository.countByPostId(postId);
    }

    // Delete like by ID
    public boolean deleteLike(String likeId) {
        Optional<like> likeOpt = likeRepository.findById(likeId);
        if (likeOpt.isPresent()) {
            likeRepository.deleteById(likeId);
            return true;
        } else {
            return false;
        }
    }
}
