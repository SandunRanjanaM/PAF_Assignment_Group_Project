package com.sliit.backend;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface notificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverUserId(String receiverUserId);
}