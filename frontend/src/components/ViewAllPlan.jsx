import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AccessTime,
  PriorityHigh,
  ArrowForwardIos as ArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import LearningPlanService from '../services/LearningPlanService';

const ViewAllPlan = () => {
  const [plans, setPlans] = useState([]);
  const [latestPlansMap, setLatestPlansMap] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await LearningPlanService.getAllPlans();
      const allPlans = response.data;

      const latestMap = {};
      allPlans.forEach((plan) => {
        const key = `${plan.userId}-${plan.progressName}`;
        if (!latestMap[key] || new Date(plan.updatedAt) > new Date(latestMap[key].updatedAt)) {
          latestMap[key] = plan;
        }
      });

      setLatestPlansMap(latestMap);
      setPlans(Object.values(latestMap));  // Update the plans state, ensuring the tasks/steps are included
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await LearningPlanService.deletePlan(id);
        fetchPlans();  // Re-fetch the plans after deletion
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const calculateTaskProgress = (task) => {
    if (!task.steps || task.steps.length === 0) return 0;
    const completedSteps = task.steps.filter(step => step.checked).length;
    return (completedSteps / task.steps.length) * 100;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 50) return '#2196f3'; // Blue
    if (percentage >= 20) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Learning Plans
      </Typography>

      {plans.length === 0 ? (
        <Typography>No learning plans found.</Typography>
      ) : (
        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {plan.title}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                    <Chip label={plan.progressName} color="primary" size="small" />
                    <Chip label={`Priority: ${plan.priority}`} color="secondary" size="small" />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>User ID:</strong> {plan.userId}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Created:</strong> {new Date(plan.createdAt).toLocaleString()}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Updated:</strong> {new Date(plan.updatedAt).toLocaleString()}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {plan.description}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Tasks and Steps Overview
                  </Typography>

                  {/* Iterate over tasks */}
                  {plan.tasks?.length > 0 ? (
                    plan.tasks.map((task, taskIndex) => (
                      <Box key={taskIndex} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {task.title}
                          </Typography>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress
                              variant="determinate"
                              value={calculateTaskProgress(task)}
                              size={60}
                              thickness={4}
                              sx={{
                                color: getProgressColor(calculateTaskProgress(task)),
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                {`${Math.round(calculateTaskProgress(task))}%`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          bgcolor: 'white',
                          p: 1,
                          borderRadius: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          <LinearProgress
                            variant="determinate"
                            value={calculateTaskProgress(task)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              width: '100%',
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(calculateTaskProgress(task)),
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>

                        <List dense disablePadding>
                          {task.steps?.map((step, stepIndex) => (
                            <React.Fragment key={stepIndex}>
                              <ListItem 
                                sx={{ 
                                  pl: 0,
                                  bgcolor: 'white',
                                  borderRadius: 1,
                                  mb: 0.5,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    bgcolor: '#f5f5f5',
                                  },
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  pr: 1
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                  <ListItemIcon>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: step.checked ? getProgressColor(100) : '#e0e0e0',
                                        width: 28,
                                        height: 28,
                                        fontSize: 14,
                                        transition: 'all 0.2s',
                                        boxShadow: step.checked ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                      }}
                                    >
                                      {stepIndex + 1}
                                    </Avatar>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={step.name}
                                    primaryTypographyProps={{
                                      sx: {
                                        color: step.checked ? 'text.secondary' : 'text.primary',
                                        transition: 'all 0.2s',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        opacity: step.checked ? 0.8 : 1
                                      }
                                    }}
                                  />
                                </Box>
                                {step.checked && (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Done"
                                    size="small"
                                    sx={{
                                      bgcolor: getProgressColor(100),
                                      color: 'white',
                                      '& .MuiChip-icon': {
                                        color: 'white'
                                      },
                                      ml: 1,
                                      transition: 'all 0.2s',
                                      '&:hover': {
                                        bgcolor: getProgressColor(100),
                                        opacity: 0.9
                                      }
                                    }}
                                  />
                                )}
                              </ListItem>
                              {stepIndex < task.steps.length - 1 && (
                                <Box display="flex" justifyContent="center" py={0.5}>
                                  <ArrowIcon fontSize="small" color="disabled" />
                                </Box>
                              )}
                            </React.Fragment>
                          ))}
                        </List>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tasks available for this plan.
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Chip
                      label={`${plan.durationValue} ${plan.durationUnit}`}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 500 }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <PriorityHigh fontSize="small" color="action" />
                    <Typography variant="body2">{plan.priority}</Typography>
                  </Stack>

                  <Box textAlign="right">
                    <Tooltip title="Delete Plan">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(plan.id)}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ViewAllPlan;
