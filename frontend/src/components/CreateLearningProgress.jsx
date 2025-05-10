import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Stack,
  Paper,
  useTheme,
  Tooltip,
  Fade,
  Alert,
  Zoom,
  CircularProgress,
  Avatar,
  Badge,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Title as TitleIcon,
  Info as InfoIcon,
  Brush as BrushIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LearningProgressService from '../services/LearningProgressService';

const CreateLearningProgress = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    progressName: '',
    newSkills: '',
    title: '',
    description: '',
    resources: '',
    progressPercentage: 0,
    tasks: [],
  });

  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateProgress = (tasks) => {
    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) {
      setSnackbar({
        open: true,
        message: 'Task cannot be empty!',
        severity: 'warning'
      });
      return;
    }

    const newTasks = [...formData.tasks, { title: trimmed, completed: false }];
    setFormData((prev) => ({
      ...prev,
      tasks: newTasks,
      progressPercentage: calculateProgress(newTasks),
    }));
    setTaskInput('');
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      tasks: updatedTasks,
      progressPercentage: calculateProgress(updatedTasks),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { userId, progressName } = formData;
      const isDuplicate = await LearningProgressService.checkDuplicateProgress(userId, progressName);

      if (isDuplicate) {
        setSnackbar({
          open: true,
          message: `A progress with name "${progressName}" already exists for this user.`,
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      await LearningProgressService.createProgress(formData);
      setSnackbar({
        open: true,
        message: 'Learning Progress created successfully!',
        severity: 'success'
      });

      setFormData({
        userId: '',
        progressName: '',
        newSkills: '',
        title: '',
        description: '',
        resources: '',
        progressPercentage: 0,
        tasks: [],
      });
      setTaskInput('');
      
      setTimeout(() => navigate('/progresses'), 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Error creating progress. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default' }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Create Learning Progress
          </Typography>
        </Stack>

        <Fade in={true}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      fullWidth
                      label="User ID"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box> */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TitleIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      fullWidth
                      label="Progress Name"
                      name="progressName"
                      value={formData.progressName}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BrushIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      fullWidth
                      label="New Skills"
                      name="newSkills"
                      value={formData.newSkills}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TitleIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <InfoIcon sx={{ color: 'primary.main', mt: 1 }} />
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MenuBookIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      fullWidth
                      label="Resources"
                      name="resources"
                      value={formData.resources}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" color="primary" fontWeight={600}>
                    Tasks
                  </Typography>

                  <Box display="flex" gap={2} alignItems="center">
                    <TextField
                      label="New Task"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Tooltip title="Add Task">
                      <IconButton
                        onClick={handleAddTask}
                        color="primary"
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.main',
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box>
                    {formData.tasks.map((task, index) => (
                      <Zoom in={true} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 1,
                            borderRadius: 1,
                            bgcolor: 'background.default',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                width: 28,
                                height: 28,
                                fontSize: 14,
                              }}
                            >
                              {index + 1}
                            </Avatar>
                            <Typography sx={{ flexGrow: 1 }}>{task.title}</Typography>
                          </Box>
                          <Tooltip title="Delete Task">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveTask(index)}
                              sx={{
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'error.contrastText',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Paper>
                      </Zoom>
                    ))}
                  </Box>

                  {formData.tasks.length > 0 && (
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Progress: {formData.progressPercentage}%
                        </Typography>
                        {formData.progressPercentage === 100 && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Completed"
                            size="small"
                            color="success"
                            sx={{ height: 24 }}
                          />
                        )}
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={formData.progressPercentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: formData.progressPercentage === 100 ? 'success.main' : 'primary.main',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/progresses')}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Progress'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Fade>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateLearningProgress;
