import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Checkbox,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  Fade,
  Zoom,
  CircularProgress,
  Avatar,
  Badge,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Title as TitleIcon,
  Info as InfoIcon,
  Brush as BrushIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import LearningProgressService from '../services/LearningProgressService';

const UpdateLearningProgress = () => {
  const theme = useTheme();
  const { progressId } = useParams();
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState({
    userId: '',
    progressName: '',
    title: '',
    description: '',
    newSkills: '',
    resources: '',
    tasks: [],
  });

  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await LearningProgressService.getAllProgresses();
        const progress = response.data.find((p) => p.id === progressId);
        if (progress) {
          const tasksWithMeta = (progress.tasks || []).map((task) => ({
            ...task,
            isExisting: true,
            wasCheckedInitially: task.completed,
          }));
          setProgressData({ ...progress, tasks: tasksWithMeta });
        } else {
          showSnackbar('Progress not found!', 'error');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress:', error);
        showSnackbar('Error loading progress data', 'error');
        setLoading(false);
      }
    };

    fetchProgress();
  }, [progressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = [...progressData.tasks];
    const task = updatedTasks[index];
    if (!task.isExisting || !task.wasCheckedInitially) {
      task.completed = !task.completed;
      setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
    }
  };

  const handleTaskTitleChange = (index, newTitle) => {
    const updatedTasks = [...progressData.tasks];
    updatedTasks[index].title = newTitle;
    setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      showSnackbar('Task cannot be empty!', 'warning');
      return;
    }
    const newTaskObj = {
      title: newTask.trim(),
      completed: false,
      isExisting: false,
    };
    setProgressData((prevData) => ({
      ...prevData,
      tasks: [...prevData.tasks, newTaskObj],
    }));
    setNewTask('');
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...progressData.tasks];
    updatedTasks.splice(index, 1);
    setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
  };

  const calculateProgressPercentage = (tasks) => {
    if (!tasks.length) return 0;
    const completedCount = tasks.filter((task) => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const sanitizedTasks = progressData.tasks.map(({ title, completed }) => ({ title, completed }));
    const calculatedPercentage = calculateProgressPercentage(sanitizedTasks);

    try {
      await LearningProgressService.updateProgress(progressId, {
        ...progressData,
        tasks: sanitizedTasks,
        progressPercentage: calculatedPercentage,
      });
      showSnackbar('Progress updated successfully!', 'success');
      setTimeout(() => navigate('/progresses'), 1000);
    } catch (error) {
      console.error('Error updating progress:', error);
      showSnackbar('Failed to update progress.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading progress data...
        </Typography>
      </Container>
    );
  }

  const calculatedProgress = calculateProgressPercentage(progressData.tasks);
  const isCompleted = calculatedProgress === 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default' }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Update Learning Progress
          </Typography>
        </Stack>

        <Fade in={true}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      label="User ID"
                      value={progressData.userId}
                      fullWidth
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.default',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TitleIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      label="Progress Name"
                      name="progressName"
                      value={progressData.progressName}
                      onChange={handleChange}
                      fullWidth
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
                      label="Title"
                      name="title"
                      value={progressData.title}
                      onChange={handleChange}
                      fullWidth
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
                      label="Description"
                      name="description"
                      value={progressData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
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
                    <BrushIcon sx={{ color: 'primary.main' }} />
                    <TextField
                      label="New Skills"
                      name="newSkills"
                      value={progressData.newSkills}
                      onChange={handleChange}
                      fullWidth
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
                      label="Resources"
                      name="resources"
                      value={progressData.resources}
                      onChange={handleChange}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Typography
                        variant="subtitle2"
                        color={isCompleted ? 'success.main' : 'text.primary'}
                      >
                        Progress: {calculatedProgress}%
                      </Typography>
                      {isCompleted && (
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
                      value={calculatedProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: isCompleted ? 'success.main' : 'primary.main',
                          borderRadius: 4,
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

                  {progressData.tasks.map((task, index) => (
                    <Zoom in={true} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
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
                          <TextField
                            value={task.title}
                            onChange={(e) => handleTaskTitleChange(index, e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                          />
                          {/* <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskToggle(index)}
                            disabled={task.isExisting && task.wasCheckedInitially}
                            sx={{
                              color: 'primary.main',
                              '&.Mui-checked': {
                                color: 'success.main',
                              },
                            }}
                          /> */}
                        </Box>
                        <Tooltip title="Delete task">
                          <IconButton
                            size="small"
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

                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      label="New Task"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
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
                </Stack>
              </Paper>

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
                  disabled={submitting}
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
                  {submitting ? 'Updating...' : 'Update Progress'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Fade>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default UpdateLearningProgress;
