import React, { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentService from '../services/CommentService';
 
const ViewCommentsByPost = ({ postId }) => {
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
      const response = await CommentService.getCommentsByPostId(postId);
      setComments(response.data || []);
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
 
  if (comments.length === 0) {
    return (
      <Typography color="textSecondary" align="center">
        No comments yet. Be the first to comment!
      </Typography>
    );
  }
 
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {comments.map(comment => (
        <ListItem
          key={comment.id}
          divider
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: editingId === comment.id ? 2 : 0 }}>
            {editingId === comment.id ? (
              <>
                <TextField
                  fullWidth
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Button
                  onClick={() => handleEdit(comment.id)}
                  variant="contained"
                  size="small"
                  sx={{ minWidth: 'auto' }}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <ListItemText
                  primary={comment.commentText}
                  secondary={`Posted by: ${comment.userId}`}
                  sx={{ flex: 1 }}
                />
                <Box>
                  <IconButton
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditText(comment.commentText);
                    }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(comment.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
 
export default ViewCommentsByPost;