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
  Paper,
  useTheme,
  Fade,
  Zoom,
  Badge,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AccessTime,
  PriorityHigh,
  ArrowForwardIos as ArrowIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';

const ViewAllPlan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [latestPlansMap, setLatestPlansMap] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

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
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      try {
        await LearningPlanService.deletePlan(id);
        await fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      } finally {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleEdit = (planId) => {
    navigate(`/update-plan/${planId}`);
  };

  const handleShare = (plan) => {
    // Implement share functionality
    console.log('Sharing plan:', plan);
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.default' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              My Learning Plans
            </Typography>
          </Stack>
          <Button
            variant="contained"
            // startIcon={<AddIcon />}
            onClick={() => navigate('/progresses')}
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
            View All Progresses
          </Button>
        </Stack>

        {plans.length === 0 ? (
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
                No learning plans found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start your learning journey by creating a new plan
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-plan')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Create Your First Plan
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {plans.map((plan) => (
              <Grid item xs={12}  key={plan.id}>
                <Zoom in={true}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
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
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                            {plan.title}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                              label={plan.progressName}
                              size="small"
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              icon={<PriorityHigh />}
                              label={`Priority: ${plan.priority}`}
                              size="small"
                              sx={{
                                bgcolor: plan.priority === 'High' ? 'error.light' : 
                                        plan.priority === 'Medium' ? 'warning.light' : 'success.light',
                                color: plan.priority === 'High' ? 'error.contrastText' :
                                      plan.priority === 'Medium' ? 'warning.contrastText' : 'success.contrastText',
                                fontWeight: 500,
                              }}
                            />
                          </Stack>
                        </Box>

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
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              <strong>User ID:</strong> {plan.userId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              <strong>Created:</strong> {new Date(plan.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Updated:</strong> {new Date(plan.updatedAt).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Paper>

                        <Divider />

                        <Typography variant="body2" color="text.secondary" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          <strong>Description:</strong> {plan.description}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight={600} color="primary">
                          Tasks and Steps Overview
                        </Typography>

                        {plan.tasks?.length > 0 ? (
                          plan.tasks.map((task, taskIndex) => (
                            <Paper
                              key={taskIndex}
                              elevation={0}
                              sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'background.default',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: 'action.hover',
                                },
                              }}
                            >
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

                              <Box sx={{ mb: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateTaskProgress(task)}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'background.paper',
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
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        mb: 0.5,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                          bgcolor: 'action.hover',
                                        },
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <ListItemIcon>
                                          <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                              step.checked ? (
                                                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                              ) : null
                                            }
                                          >
                                            <Avatar
                                              sx={{
                                                bgcolor: step.checked ? getProgressColor(100) : 'action.disabled',
                                                width: 28,
                                                height: 28,
                                                fontSize: 14,
                                                transition: 'all 0.2s',
                                              }}
                                            >
                                              {stepIndex + 1}
                                            </Avatar>
                                          </Badge>
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={step.name}
                                          primaryTypographyProps={{
                                            sx: {
                                              color: step.checked ? 'text.secondary' : 'text.primary',
                                              transition: 'all 0.2s',
                                              wordBreak: 'break-word',
                                              whiteSpace: 'pre-wrap',
                                            },
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
                                              color: 'white',
                                            },
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
                            </Paper>
                          ))
                        ) : (
                          <Alert severity="info" sx={{ borderRadius: 2 }}>
                            No tasks available for this plan.
                          </Alert>
                        )}

                        <Divider />

                        <Stack direction="row" spacing={2} alignItems="center">
                          <AccessTime fontSize="small" color="action" />
                          <Chip
                            label={`${plan.durationValue} ${plan.durationUnit}`}
                            size="small"
                            sx={{
                              bgcolor: 'info.light',
                              color: 'info.contrastText',
                              fontWeight: 500,
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Plan">
                            <IconButton
                              onClick={() => handleEdit(plan.id)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Share Plan">
                            <IconButton
                              onClick={() => handleShare(plan)}
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
                          </Tooltip> */}
                          <Tooltip title="Delete Plan">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(plan.id)}
                              disabled={deleteLoading[plan.id]}
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
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ViewAllPlan;
