import React, { useState } from 'react';
import { Circle as UnreadIcon, CheckCircle as ReadIcon, Check as CheckIcon } from '@mui/icons-material';
import './NotificationViewer.css';

import {
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box
} from '@mui/material';

import NotificationService from '../services/NotificationService';

const NotificationViewer = () => {
  const [userId, setUserId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  // Function to format the timestamp to a readable date
  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid Date';
    }

    const date = new Date(timestamp);
    if (isNaN(date)) {
      return 'Invalid Date';
    }

    return date.toLocaleString(); // This formats the date to a human-readable string
  };

  const handleFetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications(userId);
      console.log('Notifications Data:', data); // Debugging the response data
      setNotifications(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      // Update the local state to reflect the change
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead(userId);
      // Update the local state to reflect the changes
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <Paper className="notification-container">
      <Typography variant="h6" className="notification-header">
        View Notifications
      </Typography>
      <TextField
        fullWidth
        label="Enter User ID"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="notification-input"
      />
      <Box className="notification-buttons">
        <Button variant="contained" color="primary" onClick={handleFetchNotifications}>
          Fetch Notifications
        </Button>
        {notifications.length > 0 && (
          <Button variant="outlined" color="primary" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Box>

      {error && (
        <Typography className="error-message">
          {error}
        </Typography>
      )}

      {notifications.length === 0 && !error && (
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
                      Date: {formatDate(notif.date || notif.timestamp)}
                    </Typography>
                  </>
                }
              />
              {!notif.isRead && (
                <IconButton
                  edge="end"
                  aria-label="mark as read"
                  onClick={() => handleMarkAsRead(notif.id)}
                  size="small"
                  className="notification-actions"
                >
                  <CheckIcon color="primary" />
                </IconButton>
              )}
            </ListItem>
            <Divider className="notification-divider" />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationViewer;
