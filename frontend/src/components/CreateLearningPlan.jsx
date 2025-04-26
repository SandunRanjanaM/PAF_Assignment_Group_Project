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
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';

const useQuery = () => new URLSearchParams(useLocation().search);

const CreateLearningPlan = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const userId = query.get('userId') || '';
  const progressName = query.get('progressName') || '';

  const [formData, setFormData] = useState({
    userId,
    progressName,
    title: '',
    description: '',
    steps: [],
    stepInput: '',
    durationValue: '',
    durationUnit: 'days',
    priority: 'Medium',
  });

  const [existingPlan, setExistingPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExistingPlan = async () => {
      try {
        const response = await LearningPlanService.getAllPlans();
        const matchedPlan = response.data.find(
          (plan) => plan.userId === userId && plan.progressName === progressName
        );
        if (matchedPlan) {
          setExistingPlan(matchedPlan);
        }
      } catch (error) {
        console.error('Error checking existing plan:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingPlan();
  }, [userId, progressName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    const trimmed = formData.stepInput.trim();
    if (trimmed && !formData.steps.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, trimmed],
        stepInput: '',
      }));
    }
  };

  const handleRemoveStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planData = {
      ...formData,
      durationValue: parseInt(formData.durationValue),
    };

    try {
      await LearningPlanService.createLearningPlan(planData);
      alert('Learning plan created successfully!');
      navigate('/view-all-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create learning plan.');
    }
  };

  const handleRedirectToUpdate = () => {
    navigate(
      `/progresses`
    );
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Learning Plan
      </Typography>

      {existingPlan ? (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            You already have a learning plan for <strong>{progressName}</strong>.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirectToUpdate}
          >
            Go to Update Plan
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User ID"
            name="userId"
            value={formData.userId}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Progress Name"
            name="progressName"
            value={formData.progressName}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
            sx={{ mb: 2 }}
          />

          {/* Step Input */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              label="Add Step"
              name="stepInput"
              value={formData.stepInput}
              onChange={handleChange}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddStep}>
              Add
            </Button>
          </Stack>

          <Box sx={{ mb: 2 }}>
            {formData.steps.map((step, index) => (
              <Chip
                key={index}
                label={step}
                onDelete={() => handleRemoveStep(index)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          {/* Duration */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Duration Value"
              name="durationValue"
              type="number"
              value={formData.durationValue}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Duration Unit"
              name="durationUnit"
              select
              value={formData.durationUnit}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="weeks">Weeks</MenuItem>
              <MenuItem value="months">Months</MenuItem>
            </TextField>
          </Stack>

          {/* Priority */}
          <TextField
            fullWidth
            label="Priority"
            name="priority"
            select
            value={formData.priority}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Plan
          </Button>
        </form>
      )}
    </Container>
  );
};

export default CreateLearningPlan;
