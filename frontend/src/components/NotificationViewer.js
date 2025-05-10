import React, { useState, useEffect } from 'react';
import { Circle as UnreadIcon, CheckCircle as ReadIcon, Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import './NotificationViewer.css';
 
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Button
} from '@mui/material';
 
import NotificationService from '../services/NotificationService';
 
const NotificationViewer = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = "12345"; // Hardcoded user ID as requested
 
  useEffect(() => {
    fetchNotifications();
  }, []); // Fetch notifications when component mounts
 
  const formatTimeAgo = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid Date';
    }
 
    const date = new Date(timestamp);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
 
    // If less than 1 minute ago
    const diffInSeconds = (new Date() - date) / 1000;
    if (diffInSeconds < 60) {
      return 'Just now';
    }
 
    // If today or yesterday
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (isYesterday(date)) {
      return 'Yesterday';
    }
 
    // If more than yesterday, show relative time
    return formatDistanceToNow(date, { addSuffix: true });
  };
 
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getNotifications(userId);
      setNotifications(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
 
  const handleDelete = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };
 
  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead(userId);
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
 
  if (loading) {
    return (
      <Paper className="notification-container">
        <Typography>Loading notifications...</Typography>
      </Paper>
    );
  }
 
  return (
    <Paper className="notification-container">
      <Typography variant="h6" className="notification-header">
        Notifications
      </Typography>
 
      {notifications.length > 0 && (
        <Box className="notification-buttons">
          <Button variant="outlined" color="primary" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        </Box>
      )}
 
      {notifications.length === 0 && (
        <Typography className="empty-state">
          No notifications available.
        </Typography>
      )}
 
      <List className="notification-list">
        {notifications.map((notif, index) => (
          <div key={index}>
            <ListItem
              alignItems="flex-start"
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
            >
              <ListItemText
                primary={
                  <Box className="notification-content">
                    {notif.isRead ? <ReadIcon color="action" /> : <UnreadIcon color="primary" />}
                    <Typography
                      component="span"
                      className={`notification-message ${!notif.isRead ? 'unread' : ''}`}
                    >
                      {notif.message}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography className="notification-meta">
                      From: {notif.senderUserId || 'Unknown'}
                    </Typography>
                    <Typography className="notification-meta">
                      Post ID: {notif.postId}
                    </Typography>
                    <Typography className="notification-date">
                      {formatTimeAgo(notif.date || notif.timestamp)}
                    </Typography>
                  </>
                }
              />
              <Box className="notification-actions">
                {!notif.isRead && (
                  <IconButton
                    edge="end"
                    aria-label="mark as read"
                    onClick={() => handleMarkAsRead(notif.id)}
                    size="small"
                  >
                    <CheckIcon color="primary" />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  aria-label="delete notification"
                  onClick={() => handleDelete(notif.id)}
                  size="small"
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
            <Divider className="notification-divider" />
          </div>
        ))}
      </List>
    </Paper>
  );
};
 
export default NotificationViewer;
