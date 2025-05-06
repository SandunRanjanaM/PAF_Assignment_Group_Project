// src/services/NotificationService.js
import axios from 'axios';

const API_URL = 'http://localhost:5021/api/notifications/';

class NotificationService {
    static async getNotifications(userId) {
        try {
            const response = await axios.get(API_URL + userId);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications', error);
            throw error;
        }
    }
}

export default NotificationService;