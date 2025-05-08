package com.sliit.backend;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface commentRepository extends MongoRepository<comment,String>{

    List<comment>findByPostId(String postId);
}
