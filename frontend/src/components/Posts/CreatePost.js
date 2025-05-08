import React, { useState } from 'react';
import PostService from '../../services2/PostService';
import {
  Box, Button, TextField, Typography, Stack, Alert, Paper, Divider
} from '@mui/material';

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    setError('');
    setSuccess('');
  };

  const validateMedia = () => {
    if (mediaFiles.length > 3) {
      setError('You can only upload up to 3 media files.');
      return false;
    }

    for (let file of mediaFiles) {
      const type = file.type;

      if (type.startsWith('image/')) {
        if (!['image/jpeg', 'image/png'].includes(type)) {
          setError('Only .jpg and .png image formats are allowed.');
          return false;
        }
      } else if (type.startsWith('video/')) {
        const maxSizeMB = 20;
        const videoSizeMB = file.size / (1024 * 1024);

        if (videoSizeMB > maxSizeMB) {
          setError('Video size must be less than 20 MB.');
          return false;
        }

      } else {
        setError('Unsupported media format.');
        return false;
      }
    }

    return true;
  };

  const checkVideoDurations = async () => {
    const checks = mediaFiles.map(file => {
      if (!file.type.startsWith('video/')) return Promise.resolve(true);

      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration <= 30);
        };
        video.src = URL.createObjectURL(file);
      });
    });

    const results = await Promise.all(checks);
    return results.every(isValid => isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateMedia()) return;

    const videoDurationsOk = await checkVideoDurations();
    if (!videoDurationsOk) {
      setError('One or more videos exceed 30 seconds.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    mediaFiles.forEach(file => formData.append('mediaFiles', file));

    PostService.createPost(formData)
      .then(() => {
        setSuccess('Post created successfully!');
        setDescription('');
        setMediaFiles([]);
      })
      .catch(() => {
        setError('Error creating post. Please try again.');
      });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, borderRadius: 2, background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#424242', mb: 2 }}>
          Create a Post
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                  },
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                }}
              >
                Upload Media
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/jpeg,image/png,video/*"
                  onChange={handleMediaChange}
                />
              </Button>
            </Box>

            {mediaFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#4b5563' }}>
                  Media Preview:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {mediaFiles.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    const isImage = file.type.startsWith('image');
                    const isVideo = file.type.startsWith('video');

                    return isImage ? (
                      <img
                        key={idx}
                        src={url}
                        alt={`preview-${idx}`}
                        height="100"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                    ) : isVideo ? (
                      <video
                        key={idx}
                        src={url}
                        height="100"
                        controls
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                    ) : null;
                  })}
                </Stack>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                },
                borderRadius: 1,
                py: 1.5,
              }}
            >
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePost;