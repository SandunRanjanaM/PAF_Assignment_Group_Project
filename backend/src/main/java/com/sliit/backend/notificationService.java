package com.sliit.backend;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
 
@Service
public class notificationService {
 
    @Autowired
    private notificationRepository notificationRepository;
 
    @Autowired
    private MongoTemplate mongoTemplate;
 
    // Fetch all notifications for a user (Receiver)
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByReceiverUserIdOrderByTimestampDesc(userId);
    }
 
    // Delete a notification by its ID
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
 
    // Mark a single notification as read
    public void markNotificationAsRead(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update().set("isRead", true);
        mongoTemplate.updateFirst(query, update, Notification.class);
    }
 
    // Mark all notifications as read for a user
    public void markAllNotificationsAsRead(String userId) {
        Query query = new Query(Criteria.where("receiverUserId").is(userId));
        Update update = new Update().set("isRead", true);
        mongoTemplate.updateMulti(query, update, Notification.class);
    }
 
    // Create a new notification
    public Notification createNotification(String message, String postId, String receiverUserId, String senderUserId) {
        Notification notification = new Notification(message, postId, receiverUserId, senderUserId);
        return notificationRepository.save(notification);
    }
}