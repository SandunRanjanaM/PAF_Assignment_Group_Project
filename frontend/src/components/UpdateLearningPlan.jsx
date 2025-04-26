import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';

const UpdateLearningPlan = () => {
  const { id, userId, progressName } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        let response;
        if (id) {
          response = await LearningPlanService.getPlanById(id);
        } else if (userId && progressName) {
          response = await LearningPlanService.getLatestPlan(userId, progressName);
        } else {
          console.error("Missing parameters: 'id' or 'userId' and 'progressName' must be provided");
          return;
        }

        // Ensure steps is an array
        const plan = response.data;
        if (!Array.isArray(plan.steps)) {
          plan.steps = [];
        }

        setPlanData(plan);
      } catch (error) {
        console.error('Error fetching plan:', error);
      }
    };

    fetchPlan();
  }, [id, userId, progressName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...planData.steps];
    newSteps[index] = value;
    setPlanData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setPlanData((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index) => {
    const newSteps = [...planData.steps];
    newSteps.splice(index, 1);
    setPlanData((prev) => ({ ...prev, steps: newSteps }));
  };

  const validate = () => {
    const newErrors = {};
    if (planData.durationValue <= 0) {
      newErrors.durationValue = 'Duration must be a positive number';
    }

    if (planData.steps.length === 0 || planData.steps.some((s) => !s.trim())) {
      newErrors.steps = 'Steps cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      const planId = id || planData._id;
      await LearningPlanService.updatePlan(planId, planData);
      navigate('/view-all-plans');
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  if (!planData) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update Learning Plan
      </Typography>

      <TextField
        label="Title"
        name="title"
        value={planData.title || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Description"
        name="description"
        value={planData.description || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Steps
      </Typography>
      {planData.steps.map((step, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
          <TextField
            label={`Step ${index + 1}`}
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
            fullWidth
            error={!!errors.steps && !step.trim()}
          />
          <IconButton onClick={() => removeStep(index)} color="error">
            <RemoveCircle />
          </IconButton>
        </Box>
      ))}
      {errors.steps && (
        <Typography variant="caption" color="error">
          {errors.steps}
        </Typography>
      )}
      <Box sx={{ textAlign: 'left', mt: 1 }}>
        <Button variant="outlined" onClick={addStep} startIcon={<AddCircle />}>
          Add Step
        </Button>
      </Box>

      <TextField
        label="Duration Value"
        name="durationValue"
        type="number"
        value={planData.durationValue || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
        error={!!errors.durationValue}
        helperText={errors.durationValue}
      />

      <TextField
        select
        label="Duration Unit"
        name="durationUnit"
        value={planData.durationUnit || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
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
        margin="normal"
      >
        <MenuItem value="High">High</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Low">Low</MenuItem>
      </TextField>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handleUpdate}>
          Update Plan
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateLearningPlan;
