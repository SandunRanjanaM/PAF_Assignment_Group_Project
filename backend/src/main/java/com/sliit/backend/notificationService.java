package com.sliit.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class notificationService {

    @Autowired
    private notificationRepository notificationRepository;


    

    // Fetch all notifications for a user (Receiver)
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByReceiverUserId(userId);
    }

    // Delete a notification by its ID
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    
}
