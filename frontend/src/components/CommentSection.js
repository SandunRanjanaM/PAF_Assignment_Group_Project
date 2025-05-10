import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Box, Typography, Divider } from '@mui/material';
import CreateComment from './CreateComment';
import ViewCommentsByPost from './ViewCommentsByPost';
 
const CommentSection = () => {
  const { postId } = useParams();
 
  return (
    <Box sx={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Divider sx={{ my: 2 }} />
       
        {/* Create Comment Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add a Comment
          </Typography>
          <CreateComment />
        </Box>
       
        <Divider sx={{ my: 3 }} />
       
        {/* View Comments Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            All Comments
          </Typography>
          <ViewCommentsByPost postId={postId} />
        </Box>
      </Paper>
    </Box>
  );
};
 
export default CommentSection;