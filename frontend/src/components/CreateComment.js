import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import CommentService from '../services/CommentService';
import { useParams, useNavigate } from 'react-router-dom';
 
const CreateComment = () => {
  const [commentText, setCommentText] = useState('');
  const { postId } = useParams();
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async () => {
    if (!commentText.trim()) return;
 
    const newComment = {
      commentText: commentText,
      postId: postId,
      userId: "user789", // This will be the sender ID in the notification
      receiverUserId: "12345" // This ensures notification goes to user 12345
    };
 
    try {
      await CommentService.createComment(newComment);
      setSuccessMsg('Comment posted successfully!');
      setCommentText('');
      // Refresh the comments list
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };
 
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Write your comment..."
        variant="outlined"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        multiline
        rows={3}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 1 }}
      >
        Post Comment
      </Button>
      {successMsg && (
        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
          {successMsg}
        </Typography>
      )}
    </Paper>
  );
};
 
export default CreateComment;