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
import { RemoveCircle, AddCircle } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import LearningPlanService from '../services/LearningPlanService';
import axios from 'axios'; // Direct API call to LearningProgress

const UpdateLearningPlan = () => {
  const { id, userId, progressName } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [progressTasks, setProgressTasks] = useState([]);
  const [errors, setErrors] = useState({});

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
          const progressResponse = await axios.get(`/api/LearningProgress/${plan.userId}/${plan.progressName}/latest`);
          const progress = progressResponse.data;
          setProgressTasks(progress.tasks || []);
          
          // If plan.tasks is empty, prefill from progressTasks
          if (plan.tasks.length === 0 && progress.tasks) {
            const prefilledTasks = progress.tasks.map(task => ({
              title: task.title,
              steps: [], // Allow user to define steps
            }));
            setPlanData(prev => ({ ...prev, tasks: prefilledTasks }));
          }
        }
      } catch (error) {
        console.error('Error fetching plan or progress:', error);
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

  const handleUpdate = async () => {
    if (!validate()) {
      console.log('Validation failed', errors);
      return;
    }
  
    try {
      // Get the plan ID to update
      const planId = id || planData._id;
      console.log('Updating plan with ID:', planId);
  
      // **Fixed:** Ensure tasks and steps are not overwritten incorrectly
      const updatedTasks = planData.tasks.map(task => ({
        ...task,
        steps: task.steps.filter(step => step.name.trim() !== ''), // Ensure no empty steps
      }));
  
      // **Fixed:** Ensure we send the correct tasks and other fields for updating
      const updatedPlanData = {
        ...planData,
        tasks: updatedTasks, // Don't overwrite with empty tasks
      };
  
      console.log('Updated Plan Data:', JSON.stringify(updatedPlanData, null, 2));
  
      // **Check if the tasks array has valid tasks before sending**
      if (!updatedPlanData.tasks || updatedPlanData.tasks.length === 0) {
        console.error('No valid tasks in updated plan!', updatedPlanData);
        return; // Prevent sending if tasks are empty or invalid
      }
  
      // Now send the update request to your backend service
      await LearningPlanService.updatePlan(planId, updatedPlanData);
  
      console.log('Update successful');
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

      <Typography variant="h6" sx={{ mt: 3 }}>
        Tasks
      </Typography>

      {planData.tasks.map((task, taskIndex) => (
        <Box key={taskIndex} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <TextField
            label={`Task ${taskIndex + 1} Title`}
            value={task.title}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Steps
          </Typography>

          {task.steps.map((step, stepIndex) => (
            <Box key={stepIndex} display="flex" alignItems="center" gap={1} mt={1}>
              <TextField
                label={`Step ${stepIndex + 1}`}
                value={step.name}
                onChange={(e) => handleTaskStepChange(taskIndex, stepIndex, e.target.value)}
                fullWidth
                error={!!errors[`step-${taskIndex}-${stepIndex}`]}
                helperText={errors[`step-${taskIndex}-${stepIndex}`]}
              />
              <IconButton color="error" onClick={() => removeStepFromTask(taskIndex, stepIndex)}>
                <RemoveCircle />
              </IconButton>
            </Box>
          ))}

          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddCircle />}
              onClick={() => addStepToTask(taskIndex)}
            >
              Add Step
            </Button>
          </Box>
        </Box>
      ))}

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

      <Box textAlign="center" mt={4}>
        <Button variant="contained" onClick={handleUpdate}>
          Update Plan
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateLearningPlan;
