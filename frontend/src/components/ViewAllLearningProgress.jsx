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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LearningProgressService from '../services/LearningProgressService';
import LearningPlanService from '../services/LearningPlanService';

const ViewAllLearningProgress = () => {
  const [progresses, setProgresses] = useState([]);
  const [plansMap, setPlansMap] = useState({});
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

    try {
      await LearningProgressService.deleteProgress(progressId);
      fetchProgressAndPlans();
    } catch (error) {
      console.error('Failed to delete progress:', error);
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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        My Learning Progresses
      </Typography>
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
                        <Card elevation={3} sx={{ borderRadius: 3, minHeight: '100%', boxShadow: 3 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ mr: 2 }} alt={progress.userId} src={`https://api.adorable.io/avatars/50/${progress.userId}.png`} />
                              <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                                {progress.progressName}
                              </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{
                              backgroundColor: '#f7f7f7',
                              padding: 2,
                              borderRadius: 2,
                              mb: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1
                            }}>
                              <Box display="flex" alignItems="center">
                                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.primary">
                                  <strong>User ID:</strong> {progress.userId}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <TitleIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.primary">
                                  <strong>Title:</strong> {progress.title}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.primary">
                                  <strong>Description:</strong> {progress.description}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <BrushIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.primary">
                                  <strong>New Skills:</strong> {progress.newSkills}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.primary">
                                  <strong>Resources:</strong> {progress.resources}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography variant="subtitle2" color={isCompleted ? 'success.main' : 'text.primary'} gutterBottom>
                              Progress: {progress.progressPercentage}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progress.progressPercentage}
                              sx={{
                                height: 12,
                                borderRadius: 5,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: isCompleted ? '#4caf50' : '#1976d2',
                                },
                                mb: 2,
                              }}
                            />

                            {Array.isArray(progress.tasks) && progress.tasks.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.secondary">
                                  Tasks
                                </Typography>
                                <List dense sx={{ maxHeight: 150, overflowY: 'auto' }}>
                                  {progress.tasks.map((task, index) => (
                                    <ListItem key={index} alignItems="flex-start">
                                      <ListItemIcon>
                                        <Checkbox checked={task.completed} disabled />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography
                                            variant="body2"
                                            sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', color: task.completed ? 'text.secondary' : 'text.primary' }}
                                          >
                                            {task.title}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="caption" color="text.secondary">
                              Created At: {progress.createdAt ? new Date(progress.createdAt).toLocaleString() : 'N/A'}
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                              {existingPlan ? (
                                <Tooltip title="Update Plan">
                                  <IconButton onClick={() => handleUpdatePlan(existingPlan.id)} disabled={isCompleted} color="primary">
                                    <UpdateIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Create Plan">
                                  <IconButton onClick={() => handleCreatePlan(progress)} disabled={isCompleted} color="success">
                                    <AddCircleIcon />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="Update Progress">
                                <IconButton onClick={() => handleUpdateProgress(progress.id)} color="warning">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Progress">
                                <IconButton onClick={() => handleDeleteProgress(progress.id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              {isCompleted && (
                              <Tooltip title="Share to Feed">
                                <IconButton onClick={() => handleShareProgress(progress)} color="secondary">
                                  <ShareIcon />
                                </IconButton>
                              </Tooltip>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
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
    </Container>
  );
};

export default ViewAllLearningProgress;
