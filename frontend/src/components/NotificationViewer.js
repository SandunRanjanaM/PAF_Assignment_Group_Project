import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
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
      <Button variant="contained" color="primary" onClick={handleFetchNotifications} style={{ marginTop: 10 }}>
        Fetch Notifications
      </Button>

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
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={notif.message}
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
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationViewer;
