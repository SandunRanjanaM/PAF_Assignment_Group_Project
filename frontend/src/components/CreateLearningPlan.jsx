import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
  Fade,
  Zoom,
  CircularProgress,
  LinearProgress,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';
import LearningProgressService from '../services/LearningProgressService';

const useQuery = () => new URLSearchParams(useLocation().search);

const CreateLearningPlan = () => {
  const theme = useTheme();
  const query = useQuery();
  const navigate = useNavigate();

  const userId = query.get('userId') || '';
  const progressName = query.get('progressName') || '';

  const [formData, setFormData] = useState({
    userId,
    progressName,
    title: '',
    description: '',
    durationValue: '',
    durationUnit: 'days',
    priority: 'Medium',
  });

  const [tasksWithSteps, setTasksWithSteps] = useState([]);
  const [existingPlan, setExistingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newStepInputs, setNewStepInputs] = useState({});
  const [error, setError] = useState('');

  // Fetch existing plan and tasks from LearningProgress
  useEffect(() => {
    const init = async () => {
      try {
        const plansResponse = await LearningPlanService.getAllPlans();
        const matchedPlan = plansResponse.data.find(
          (plan) => plan.userId === userId && plan.progressName === progressName
        );
        if (matchedPlan) {
          setExistingPlan(matchedPlan);
          return;
        }

        const progressesResponse = await LearningProgressService.getAllProgresses();
        const matchedProgress = progressesResponse.data.find(
          (p) => p.userId === userId && p.progressName === progressName
        );

        if (matchedProgress && matchedProgress.tasks) {
          const tasks = matchedProgress.tasks.map((task) => ({
            title: task.title,
            completed: false,
            steps: task.steps || [], // initialize with steps if any
          }));
          setTasksWithSteps(tasks);

          // Initialize newStepInputs for each task
          const inputState = {};
          tasks.forEach((task) => {
            inputState[task.title] = ''; // default step input as empty
          });
          setNewStepInputs(inputState);
        }
      } catch (error) {
        console.error('Error initializing plan:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [userId, progressName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepInputChange = (taskTitle, value) => {
    setNewStepInputs((prev) => ({ ...prev, [taskTitle]: value }));
  };

  const handleAddStep = (taskTitle) => {
    const trimmedStep = newStepInputs[taskTitle]?.trim();
    if (!trimmedStep) return;

    setTasksWithSteps((prev) =>
      prev.map((task) =>
        task.title === taskTitle && !task.steps.includes(trimmedStep)
          ? { ...task, steps: [...task.steps, { name: trimmedStep, checked: false }] }
          : task
      )
    );

    setNewStepInputs((prev) => ({ ...prev, [taskTitle]: '' }));
  };

  const handleRemoveStep = (taskTitle, index) => {
    setTasksWithSteps((prev) =>
      prev.map((task) =>
        task.title === taskTitle
          ? { ...task, steps: task.steps.filter((_, i) => i !== index) }
          : task
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const planData = {
        ...formData,
        durationValue: parseInt(formData.durationValue),
        tasks: tasksWithSteps,
      };

      await LearningPlanService.createLearningPlan(planData);
      navigate('/view-all-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      setError('Failed to create learning plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedirectToUpdate = () => {
    navigate(`/progresses`);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading plan data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default' }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Create Learning Plan
          </Typography>
        </Stack>

        {existingPlan ? (
          <Fade in={true}>
            <Box>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: 'primary.main',
                  },
                }}
              >
                You already have a learning plan for <strong>{progressName}</strong>.
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedirectToUpdate}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Go to Update Plan
              </Button>
            </Box>
          </Fade>
        ) : (
          <Fade in={true}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="User ID"
                      name="userId"
                      value={formData.userId}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.default',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Progress Name"
                      name="progressName"
                      value={formData.progressName}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.default',
                        },
                      }}
                    />
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack spacing={2}>
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
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Stack>
                </Paper>

                {tasksWithSteps.map((task, taskIdx) => (
                  <Zoom in={true} key={taskIdx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: theme.shadows[2],
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              width: 32,
                              height: 32,
                            }}
                          >
                            {taskIdx + 1}
                          </Avatar>
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            {task.title}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <TextField
                            label="Add Step"
                            value={newStepInputs[task.title] || ''}
                            onChange={(e) => handleStepInputChange(task.title, e.target.value)}
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
                          <Tooltip title="Add Step">
                            <IconButton
                              onClick={() => handleAddStep(task.title)}
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
                        </Stack>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {task.steps.map((step, idx) => (
                            <Chip
                              key={idx}
                              label={step.name}
                              onDelete={() => handleRemoveStep(task.title, idx)}
                              sx={{
                                bgcolor: 'background.default',
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                },
                                '& .MuiChip-deleteIcon': {
                                  color: 'error.main',
                                  '&:hover': {
                                    color: 'error.dark',
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Stack>
                    </Paper>
                  </Zoom>
                ))}

                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" color="primary" fontWeight={600}>
                      Duration & Priority
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Duration Value"
                        name="durationValue"
                        type="number"
                        value={formData.durationValue}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{ min: 1 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Duration Unit"
                        name="durationUnit"
                        select
                        value={formData.durationUnit}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      >
                        <MenuItem value="days">Days</MenuItem>
                        <MenuItem value="weeks">Weeks</MenuItem>
                        <MenuItem value="months">Months</MenuItem>
                      </TextField>
                    </Stack>

                    <TextField
                      fullWidth
                      label="Priority"
                      name="priority"
                      select
                      value={formData.priority}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </TextField>
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
                    onClick={() => navigate('/view-all-plans')}
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
                    {submitting ? 'Creating...' : 'Create Learning Plan'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Fade>
        )}
      </Paper>
    </Container>
  );
};

export default CreateLearningPlan;
