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
import LearningProgressService from '../services/LearningProgressService';

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
    durationValue: '',
    durationUnit: 'days',
    priority: 'Medium',
  });

  const [tasksWithSteps, setTasksWithSteps] = useState([]);
  const [existingPlan, setExistingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStepInputs, setNewStepInputs] = useState({}); // temp storage for step input values

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

    const planData = {
      ...formData,
      durationValue: parseInt(formData.durationValue),
      tasks: tasksWithSteps,
    };

    try {
      await LearningPlanService.createLearningPlan(planData);
      alert('Learning plan created successfully!');
      navigate('/view-all-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create learning plan. Please check console for more details.');
    }
  };

  const handleRedirectToUpdate = () => {
    navigate(`/progresses`);
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
            rows={3}
            required
            sx={{ mb: 2 }}
          />

          {/* Tasks & Steps */}
          {tasksWithSteps.map((task, taskIdx) => (
            <Box key={taskIdx} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{task.title}</Typography>

              <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                <TextField
                  label="Add Step"
                  value={newStepInputs[task.title] || ''}
                  onChange={(e) => handleStepInputChange(task.title, e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={() => handleAddStep(task.title)}>
                  Add
                </Button>
              </Stack>

              <Box>
                {task.steps.map((step, idx) => (
                  <Chip
                    key={idx}
                    label={step.name}
                    onDelete={() => handleRemoveStep(task.title, idx)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          ))}

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
