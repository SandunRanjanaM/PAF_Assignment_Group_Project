import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Checkbox,
  LinearProgress,
  Paper,
  useTheme,
  Stack,
  Tooltip,
  Fade,
  Divider,
  Alert,
  Snackbar,
  Zoom,
  Avatar,
  Badge,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  RemoveCircle,
  AddCircle,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';
import LearningProgressService from '../services/LearningProgressService';

const UpdateLearningPlan = () => {
  const theme = useTheme();
  const { id, userId, progressName } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [progressTasks, setProgressTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchPlanAndProgressTasks = async () => {
      try {
        let planResponse;
        if (id) {
          planResponse = await LearningPlanService.getPlanById(id);
        } else if (userId && progressName) {
          planResponse = await LearningPlanService.getLatestPlan(userId, progressName);
        } else {
          console.error('Missing parameters.');
          return;
        }

        const plan = planResponse.data;

        // Ensure plan has tasks array
        if (!Array.isArray(plan.tasks)) plan.tasks = [];
        plan.tasks.forEach(task => {
          if (!Array.isArray(task.steps)) task.steps = [];
        });

        setPlanData(plan);

        // Fetch progress tasks and ensure they are passed to prefill plan if needed
        if (plan.userId && plan.progressName) {
          const progressResponse = await LearningProgressService.getAllProgresses();
          const progress = progressResponse.data.find(
            p => p.userId === plan.userId && p.progressName === plan.progressName
          );
          
          if (progress && progress.tasks) {
            setProgressTasks(progress.tasks);
            
            // If plan.tasks is empty or missing some tasks from progress, update it
            const progressTaskTitles = progress.tasks.map(t => t.title);
            const existingTaskTitles = plan.tasks.map(t => t.title);
            
            // Add missing tasks from progress
            const missingTasks = progress.tasks
              .filter(pt => !existingTaskTitles.includes(pt.title))
              .map(pt => ({
                title: pt.title,
                completed: pt.completed,
                steps: []
              }));

            if (missingTasks.length > 0) {
              setPlanData(prev => ({
                ...prev,
                tasks: [...prev.tasks, ...missingTasks]
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching plan or progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndProgressTasks();
  }, [id, userId, progressName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskStepChange = (taskIndex, stepIndex, value) => {
    const newTasks = [...planData.tasks];
    newTasks[taskIndex].steps[stepIndex].name = value;
    setPlanData(prev => ({ ...prev, tasks: newTasks }));
  };

  const addStepToTask = (taskIndex) => {
    const newTasks = [...planData.tasks];
    newTasks[taskIndex].steps.push({ name: '', checked: false });
    setPlanData(prev => ({ ...prev, tasks: newTasks }));
  };

  const removeStepFromTask = (taskIndex, stepIndex) => {
    const newTasks = [...planData.tasks];
    newTasks[taskIndex].steps.splice(stepIndex, 1);
    setPlanData(prev => ({ ...prev, tasks: newTasks }));
  };

  const handleStepCheck = (taskIndex, stepIndex, checked) => {
    const newTasks = [...planData.tasks];
    newTasks[taskIndex].steps[stepIndex].checked = checked;
    
    // Calculate task completion based on steps
    const taskSteps = newTasks[taskIndex].steps;
    const completedSteps = taskSteps.filter(step => step.checked).length;
    newTasks[taskIndex].completed = completedSteps === taskSteps.length;
    
    setPlanData(prev => ({ ...prev, tasks: newTasks }));
  };

  const calculateTaskProgress = (task) => {
    if (!task.steps || task.steps.length === 0) return 0;
    const completedSteps = task.steps.filter(step => step.checked).length;
    return (completedSteps / task.steps.length) * 100;
  };

  const validate = () => {
    const newErrors = {};

    if (planData.durationValue <= 0) {
      newErrors.durationValue = 'Duration must be a positive number';
    }

    planData.tasks.forEach((task, taskIndex) => {
      task.steps.forEach((step, stepIndex) => {
        if (!step.name || !step.name.trim()) {
          newErrors[`step-${taskIndex}-${stepIndex}`] = 'Step cannot be empty';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbar({
        open: true,
        message: 'Please fix the validation errors before updating.',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);
    try {
      const planId = id || planData._id;
      const updatedTasks = planData.tasks.map(task => ({
        ...task,
        steps: task.steps.filter(step => step.name.trim() !== ''),
      }));

      const updatedPlanData = {
        ...planData,
        tasks: updatedTasks,
      };

      await LearningPlanService.updatePlan(planId, updatedPlanData);
      setSnackbar({
        open: true,
        message: 'Plan updated successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/view-all-plans'), 1000);
    } catch (error) {
      console.error('Error updating plan:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update plan. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
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
            Update Learning Plan
          </Typography>
        </Stack>

        <Fade in={true}>
          <form onSubmit={handleUpdate}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    name="title"
                    value={planData.title || ''}
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

                  <TextField
                    label="Description"
                    name="description"
                    value={planData.description || ''}
                    onChange={handleChange}
                    fullWidth
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

              <Typography variant="h6" color="primary" fontWeight={600}>
                Tasks
              </Typography>

              {planData.tasks.map((task, taskIndex) => (
                <Zoom in={true} key={taskIndex}>
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
                          {taskIndex + 1}
                        </Avatar>
                        <TextField
                          label={`Task ${taskIndex + 1} Title`}
                          value={task.title}
                          fullWidth
                          InputProps={{ readOnly: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'background.default',
                            },
                          }}
                        />
                      </Box>

                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Progress: {calculateTaskProgress(task).toFixed(0)}%
                          </Typography>
                          {calculateTaskProgress(task) === 100 && (
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
                          value={calculateTaskProgress(task)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'background.default',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(calculateTaskProgress(task)),
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>

                      <Typography variant="subtitle2" color="primary" fontWeight={600}>
                        Steps
                      </Typography>

                      {task.steps.map((step, stepIndex) => (
                        <Box
                          key={stepIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'background.default',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Checkbox
                            checked={step.checked || false}
                            onChange={(e) => handleStepCheck(taskIndex, stepIndex, e.target.checked)}
                            sx={{
                              color: 'primary.main',
                              '&.Mui-checked': {
                                color: 'success.main',
                              },
                            }}
                          />
                          <TextField
                            label={`Step ${stepIndex + 1}`}
                            value={step.name}
                            onChange={(e) => handleTaskStepChange(taskIndex, stepIndex, e.target.value)}
                            fullWidth
                            size="small"
                            error={!!errors[`step-${taskIndex}-${stepIndex}`]}
                            helperText={errors[`step-${taskIndex}-${stepIndex}`]}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                          />
                          <Tooltip title="Remove Step">
                            <IconButton
                              color="error"
                              onClick={() => removeStepFromTask(taskIndex, stepIndex)}
                              sx={{
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'error.contrastText',
                                },
                              }}
                            >
                              <RemoveCircle />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}

                      <Box textAlign="center">
                        <Button
                          variant="outlined"
                          startIcon={<AddCircle />}
                          onClick={() => addStepToTask(taskIndex)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          Add Step
                        </Button>
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
                  <TextField
                    label="Duration Value"
                    name="durationValue"
                    type="number"
                    value={planData.durationValue || ''}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ min: 1 }}
                    error={!!errors.durationValue}
                    helperText={errors.durationValue}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />

                  <TextField
                    select
                    label="Duration Unit"
                    name="durationUnit"
                    value={planData.durationUnit || ''}
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

                  <TextField
                    select
                    label="Priority"
                    name="priority"
                    value={planData.priority || ''}
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
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </TextField>
                </Stack>
              </Paper>

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
                  {submitting ? 'Updating...' : 'Update Plan'}
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

export default UpdateLearningPlan;
