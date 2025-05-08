package com.sliit.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class notificationController {

    @Autowired
    private notificationService notificationService;

    // Endpoint to get all notifications for a user
    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    // Endpoint to delete a specific notification by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // Endpoint to mark a notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id) {
        notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    // Endpoint to mark all notifications as read for a user
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<?> markAllNotificationsAsRead(@PathVariable String userId) {
        notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok().build();
    }
}