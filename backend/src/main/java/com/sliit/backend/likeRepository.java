package com.sliit.backend;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface likeRepository extends MongoRepository<like, String> {

        List<like>findByPostId(String postId);
        
        // Add the countByPostId method to count likes for a specific postId
        long countByPostId(String postId); // This counts the number of likes for a specific postId
}
