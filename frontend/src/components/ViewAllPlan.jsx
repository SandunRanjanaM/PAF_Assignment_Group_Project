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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AccessTime,
  PriorityHigh,
  ArrowForwardIos as ArrowIcon,
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
      setPlans(Object.values(latestMap));
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await LearningPlanService.deletePlan(id);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
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
                    Steps Overview
                  </Typography>
                  <List dense disablePadding>
                    {plan.steps?.map((step, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: 12 }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                        {index < plan.steps.length - 1 && (
                          <Box display="flex" justifyContent="center" py={0.5}>
                            <ArrowIcon fontSize="small" color="disabled" />
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
                  </List>

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
