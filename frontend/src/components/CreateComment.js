// src/components/CreateComment.js
import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import CommentService from '../services/CommentService';

const CreateComment = () => {
  const [commentText, setCommentText] = useState('');
  const [postId, setPostId] = useState('fakePost001'); // Dummy postId
  const [userId, setUserId] = useState('user789'); // Simulated commenter
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      commentText: commentText,
      postId: postId,
      userId: userId
    };

    try {
      await CommentService.createComment(newComment);
      setSuccessMsg('Comment posted and notification sent!');
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: 600, margin: '20px auto' }}>
      <Typography variant="h6" gutterBottom>
        Leave a Comment
      </Typography>
      <TextField
        fullWidth
        label="Write your comment..."
        variant="outlined"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        multiline
        rows={4}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Post Comment
      </Button>
      {successMsg && (
        <Typography variant="body2" color="success.main" style={{ marginTop: 10 }}>
          {successMsg}
        </Typography>
      )}
    </Paper>
  );
};

export default CreateComment;
