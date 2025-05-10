import React, { useState } from 'react';
import PostService from '../../services2/PostService';
import {
  Box, Button, TextField, Typography, Stack, Alert, Paper, Divider,
  IconButton, Tooltip, Zoom, Fade, LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    setError('');
    setSuccess('');
  };

  const removeMediaFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
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
    setIsSubmitting(true);

    if (!validateMedia()) {
      setIsSubmitting(false);
      return;
    }

    const videoDurationsOk = await checkVideoDurations();
    if (!videoDurationsOk) {
      setError('One or more videos exceed 30 seconds.');
      setIsSubmitting(false);
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
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 5, 
      p: 2,
      minHeight: 'auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
    }}>
      <Stack spacing={3} sx={{ width: 'fit-content' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: 600, 
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#2c3e50', 
              mb: 2,
              background: 'linear-gradient(45deg, #2c3e50, #3498db)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create a Post
          </Typography>

          <Divider sx={{ 
            mb: 3,
            background: 'linear-gradient(to right, transparent, #e0e0e0, transparent)',
            height: '1px',
          }} />

          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  }
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}
          {success && (
            <Fade in={!!success}>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  }
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

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
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#3498db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3498db',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#2c3e50',
                  }
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative',
              }}>
                <Tooltip title="Upload Media" TransitionComponent={Zoom}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      },
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      transition: 'all 0.3s ease',
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
                </Tooltip>
              </Box>

              {mediaFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: '#2c3e50',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Media Preview ({mediaFiles.length}/3)
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                      flexWrap: 'wrap', 
                      gap: 2,
                    }}
                  >
                    {mediaFiles.map((file, idx) => {
                      const url = URL.createObjectURL(file);
                      const isImage = file.type.startsWith('image');
                      const isVideo = file.type.startsWith('video');

                      return (
                        <Box
                          key={idx}
                          sx={{
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            }
                          }}
                        >
                          {isImage ? (
                            <img
                              src={url}
                              alt={`preview-${idx}`}
                              height="120"
                              style={{ 
                                borderRadius: 8,
                                objectFit: 'cover',
                              }}
                            />
                          ) : isVideo ? (
                            <video
                              src={url}
                              height="120"
                              controls
                              style={{ 
                                borderRadius: 8,
                                objectFit: 'cover',
                              }}
                            />
                          ) : null}
                          <Tooltip title="Remove" TransitionComponent={Zoom}>
                            <IconButton
                              size="small"
                              onClick={() => removeMediaFile(idx)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: alpha('#000', 0.5),
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: alpha('#000', 0.7),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {isSubmitting && (
                <LinearProgress 
                  sx={{ 
                    borderRadius: 1,
                    height: 6,
                    backgroundColor: alpha('#3498db', 0.1),
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #3498db, #2980b9)',
                    }
                  }} 
                />
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  borderRadius: 2,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  mb: 0
                }}
              >
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Instructions Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            width: 600, 
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#1e40af',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Post Creation Guidelines
          </Typography>
          <Stack spacing={1.5}>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              Maximum of 3 media files (photos and/or videos) can be uploaded per post
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              Supported image formats: JPG and PNG
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              Videos must be under 30 seconds in duration
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              Maximum video file size: 20MB
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              You can remove any uploaded media by clicking the delete icon on the preview
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>•</span>
              Add a description to provide context for your post
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default CreatePost;