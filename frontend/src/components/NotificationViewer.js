import React, { useState } from 'react';
import { Circle as UnreadIcon, CheckCircle as ReadIcon, Check as CheckIcon } from '@mui/icons-material';

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
    <Paper elevation={3} style={{ padding: '20px', maxWidth: 700, margin: '20px auto' }}>
      <Typography variant="h6" gutterBottom>
        View Notifications
      </Typography>
      <TextField
        fullWidth
        label="Enter User ID"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        margin="normal"
      />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
        <Typography color="error" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}

      {/* If no notifications */}
      {notifications.length === 0 && !error && (
        <Typography color="textSecondary" style={{ marginTop: 20 }}>
          No notifications available.
        </Typography>
      )}

      <List style={{ marginTop: 20 }}>
        {notifications.map((notif, index) => (
          <div key={index}>
            <ListItem
              alignItems="flex-start"
              sx={{
                backgroundColor: notif.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {notif.isRead ? <ReadIcon color="action" /> : <UnreadIcon color="primary" />}
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}
                    >
                      {notif.message}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      From: {notif.senderUserId || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Post ID: {notif.postId}
                    </Typography>
                    <div style={{ marginTop: 5 }}>
                      {/* Added check for undefined dates */}
                      <Typography variant="body2" color="textSecondary">
                        Date: {formatDate(notif.date || notif.timestamp)} {/* Use 'timestamp' if 'date' is missing */}
                      </Typography>
                    </div>
                  </>
                }
              />
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
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationViewer;
