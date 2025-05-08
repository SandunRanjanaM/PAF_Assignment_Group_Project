import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentService from '../services/CommentService';

const ViewCommentsByPost = () => {
  const [postId, setPostId] = useState('');
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await CommentService.getCommentsByPostId(postId);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await CommentService.deleteComment(id);
      setComments(comments.filter(comment => comment.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await CommentService.updateComment(id, { commentText: editText });
      const updated = comments.map(c =>
        c.id === id ? { ...c, commentText: editText } : c
      );
      setComments(updated);
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20, maxWidth: 600, margin: '20px auto' }}>
      <Typography variant="h6" gutterBottom>
        View Comments by Post ID
      </Typography>
      <TextField
        label="Enter Post ID"
        fullWidth
        margin="normal"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
      />
      <Button variant="contained" onClick={fetchComments} sx={{ mt: 1 }}>
        Load Comments
      </Button>

      <List>
        {comments.map(comment => (
          <ListItem key={comment.id} divider>
            {editingId === comment.id ? (
              <>
                <TextField
                  fullWidth
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <Button onClick={() => handleEdit(comment.id)}>Save</Button>
              </>
            ) : (
              <>
                <ListItemText primary={comment.commentText} />
                <IconButton onClick={() => {
                  setEditingId(comment.id);
                  setEditText(comment.commentText);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(comment.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ViewCommentsByPost;
