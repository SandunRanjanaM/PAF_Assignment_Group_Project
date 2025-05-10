import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Divider,
  IconButton,
  Stack,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Avatar,
  Paper,
  useTheme,
  Fade,
  Zoom,
  Badge,
  Alert,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Brush as BrushIcon,
  MenuBook as MenuBookIcon,
  Title as TitleIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LearningProgressService from '../services/LearningProgressService';
import LearningPlanService from '../services/LearningPlanService';

const ViewAllLearningProgress = () => {
  const theme = useTheme();
  const [progresses, setProgresses] = useState([]);
  const [plansMap, setPlansMap] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgressAndPlans();
  }, []);

  const fetchProgressAndPlans = async () => {
    try {
      const progressResponse = await LearningProgressService.getAllProgresses();
      const allProgresses = progressResponse.data;

      const planResponse = await LearningPlanService.getAllPlans();
      const planMap = {};
      planResponse.data.forEach((plan) => {
        const key = `${plan.userId}_${plan.progressName}`;
        planMap[key] = plan;
      });

      const updatedProgresses = allProgresses.map(progress => {
        const key = `${progress.userId}_${progress.progressName}`;
        const plan = planMap[key];

        if (plan && plan.tasks) {
          // Update task completion status based on plan steps
          const updatedTasks = progress.tasks.map(task => {
            // Robust matching: case-insensitive, trimmed
            const planTask = plan.tasks.find(
              pt => pt.title.trim().toLowerCase() === task.title.trim().toLowerCase()
            );
            if (planTask && Array.isArray(planTask.steps) && planTask.steps.length > 0) {
              const allStepsCompleted = planTask.steps.every(step => step.checked);
              return {
                ...task,
                completed: allStepsCompleted
              };
            }
            // If no steps, consider not completed (or set to true if you want)
            return { ...task, completed: false };
          });

          // Calculate new progress percentage
          const completedTasks = updatedTasks.filter(task => task.completed).length;
          const progressPercentage = updatedTasks.length > 0 
            ? Math.round((completedTasks / updatedTasks.length) * 100)
            : 0;

          return {
            ...progress,
            tasks: updatedTasks,
            progressPercentage
          };
        }
        return progress;
      });

      setProgresses(updatedProgresses);
      setPlansMap(planMap);
    } catch (error) {
      console.error('Error fetching progresses or plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = (progress) => {
    navigate(`/create-plan?userId=${encodeURIComponent(progress.userId)}&progressName=${encodeURIComponent(progress.progressName)}`);
  };

  const handleUpdatePlan = (planId) => {
    navigate(`/update-plan/${planId}`);
  };

  const handleUpdateProgress = (progressId) => {
    navigate(`/update-progress/${progressId}`);
  };

  const handleDeleteProgress = async (progressId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this progress?');
    if (!confirmDelete) return;

    setDeleteLoading(prev => ({ ...prev, [progressId]: true }));
    try {
      await LearningProgressService.deleteProgress(progressId);
      await fetchProgressAndPlans();
    } catch (error) {
      console.error('Failed to delete progress:', error);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [progressId]: false }));
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedProgresses = Array.from(progresses);
    const [movedProgress] = reorderedProgresses.splice(source.index, 1);
    reorderedProgresses.splice(destination.index, 0, movedProgress);

    setProgresses(reorderedProgresses);
  };

  const handleShareProgress = (progress) => {
    // Implement share functionality
    console.log('Sharing progress:', progress);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading your learning progress...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              My Learning Progresses
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-progress')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            Create New Progress
          </Button>
        </Stack>

        {progresses.length === 0 ? (
          <Fade in={true}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No learning progress found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start tracking your learning journey by creating a new progress
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-progress')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Create Your First Progress
              </Button>
            </Paper>
          </Fade>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="progresses" direction="horizontal">
              {(provided) => (
                <Grid container spacing={3} {...provided.droppableProps} ref={provided.innerRef}>
                  {progresses.map((progress, index) => {
                    const key = `${progress.userId}_${progress.progressName}`;
                    const existingPlan = plansMap[key];
                    const isCompleted = progress.progressPercentage === 100;

                    return (
                      <Draggable draggableId={progress.id} index={index} key={progress.id}>
                        {(provided) => (
                          <Grid item xs={12} sm={6} md={4} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Zoom in={true}>
                              <Card
                                elevation={0}
                                sx={{
                                  height: '100%',
                                  borderRadius: 4,
                                  bgcolor: 'background.paper',
                                  transition: 'all 0.3s ease',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: theme.shadows[8],
                                    borderColor: 'primary.main',
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                      <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                          isCompleted ? (
                                            <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                          ) : null
                                        }
                                      >
                                        <Avatar
                                          sx={{
                                            width: 48,
                                            height: 48,
                                            mr: 2,
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                          }}
                                        >
                                          {progress.userId.charAt(0).toUpperCase()}
                                        </Avatar>
                                      </Badge>
                                      <Typography variant="h6" fontWeight={600} color="primary">
                                        {progress.progressName}
                                      </Typography>
                                    </Box>

                                    <Divider />

                                    <Paper
                                      elevation={0}
                                      sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Stack spacing={1}>
                                        {/* <Box display="flex" alignItems="center">
                                          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.primary">
                                            <strong>User ID:</strong> {progress.userId}
                                          </Typography>
                                        </Box> */}

                                        <Box display="flex" alignItems="center">
                                          <TitleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.primary">
                                            <strong>Title:</strong> {progress.title}
                                          </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center">
                                          <InfoIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                          <Typography 
                                            variant="body2" 
                                            color="text.primary"
                                            sx={{
                                              display: '-webkit-box',
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: 'vertical',
                                              overflow: 'hidden',
                                            }}
                                          >
                                            <strong>Description:</strong> {progress.description}
                                          </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center">
                                          <BrushIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.primary">
                                            <strong>New Skills:</strong> {progress.newSkills}
                                          </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center">
                                          <MenuBookIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                          <Typography variant="body2" color="text.primary">
                                            <strong>Resources:</strong> {progress.resources}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </Paper>

                                    <Box>
                                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                        <Typography
                                          variant="subtitle2"
                                          color={isCompleted ? 'success.main' : 'text.primary'}
                                        >
                                          Progress: {progress.progressPercentage}%
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
                                        value={progress.progressPercentage}
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

                                    {Array.isArray(progress.tasks) && progress.tasks.length > 0 ? (
                                      <Paper
                                        elevation={0}
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          bgcolor: 'background.default',
                                          maxHeight: 200,
                                          overflow: 'auto',
                                          border: '1px solid',
                                          borderColor: 'divider',
                                        }}
                                      >
                                        <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.secondary">
                                          Tasks
                                        </Typography>
                                        <List dense>
                                          {progress.tasks.map((task, index) => (
                                            <ListItem
                                              key={index}
                                              sx={{
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                mb: 0.5,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                  bgcolor: 'action.hover',
                                                },
                                              }}
                                            >
                                              <ListItemIcon>
                                                <Checkbox
                                                  checked={task.completed}
                                                  disabled
                                                  sx={{
                                                    color: task.completed ? 'success.main' : 'action.disabled',
                                                  }}
                                                />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      wordBreak: 'break-word',
                                                      whiteSpace: 'pre-wrap',
                                                      color: task.completed ? 'text.secondary' : 'text.primary',
                                                      //textDecoration: task.completed ? 'line-through' : 'none',
                                                    }}
                                                  >
                                                    {task.title}
                                                  </Typography>
                                                }
                                              />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </Paper>
                                    ) : (
                                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        No tasks available for this progress.
                                      </Alert>
                                    )}

                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <AccessTimeIcon fontSize="small" color="action" />
                                      <Typography variant="caption" color="text.secondary">
                                        Created: {progress.createdAt ? new Date(progress.createdAt).toLocaleString() : 'N/A'}
                                      </Typography>
                                    </Stack>

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      justifyContent="center"
                                      sx={{
                                        '& .MuiIconButton-root': {
                                          transition: 'all 0.2s',
                                          '&:hover': {
                                            transform: 'scale(1.1)',
                                          },
                                        },
                                      }}
                                    >
                                      {existingPlan ? (
                                        <Tooltip title="Update Plan">
                                          <IconButton
                                            onClick={() => handleUpdatePlan(existingPlan.id)}
                                            disabled={isCompleted}
                                            sx={{
                                              color: 'primary.main',
                                              '&:hover': {
                                                bgcolor: 'primary.light',
                                                color: 'primary.contrastText',
                                              },
                                            }}
                                          >
                                            <UpdateIcon />
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Create Plan">
                                          <IconButton
                                            onClick={() => handleCreatePlan(progress)}
                                            disabled={isCompleted}
                                            sx={{
                                              color: 'success.main',
                                              '&:hover': {
                                                bgcolor: 'success.light',
                                                color: 'success.contrastText',
                                              },
                                            }}
                                          >
                                            <AddCircleIcon />
                                          </IconButton>
                                        </Tooltip>
                                      )}

                                      <Tooltip title="Update Progress">
                                        <IconButton
                                          onClick={() => handleUpdateProgress(progress.id)}
                                          sx={{
                                            color: 'warning.main',
                                            '&:hover': {
                                              bgcolor: 'warning.light',
                                              color: 'warning.contrastText',
                                            },
                                          }}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                      </Tooltip>

                                      <Tooltip title="Delete Progress">
                                        <IconButton
                                          onClick={() => handleDeleteProgress(progress.id)}
                                          disabled={deleteLoading[progress.id]}
                                          sx={{
                                            color: 'error.main',
                                            '&:hover': {
                                              bgcolor: 'error.light',
                                              color: 'error.contrastText',
                                            },
                                          }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>

                                      {isCompleted && (
                                        <Tooltip title="Share to Feed">
                                          <IconButton
                                            onClick={() => handleShareProgress(progress)}
                                            sx={{
                                              color: 'secondary.main',
                                              '&:hover': {
                                                bgcolor: 'secondary.light',
                                                color: 'secondary.contrastText',
                                              },
                                            }}
                                          >
                                            <ShareIcon />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Zoom>
                          </Grid>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Paper>
    </Container>
  );
};

export default ViewAllLearningProgress;
