import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LearningProgressService from '../services/LearningProgressService';

const CreateLearningProgress = () => {
  const [formData, setFormData] = useState({
    userId: '',
    progressName: '',
    newSkills: '',
    title: '',
    description: '',
    resources: '',
    progressPercentage: 0,
    tasks: [],
  });

  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateProgress = (tasks) => {
    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (trimmed) {
      const newTasks = [...formData.tasks, { title: trimmed, completed: false }];
      setFormData((prev) => ({
        ...prev,
        tasks: newTasks,
        progressPercentage: calculateProgress(newTasks),
      }));
      setTaskInput('');
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      tasks: updatedTasks,
      progressPercentage: calculateProgress(updatedTasks),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { userId, progressName } = formData;
      const isDuplicate = await LearningProgressService.checkDuplicateProgress(userId, progressName);

      if (isDuplicate) {
        alert(`A progress with name "${progressName}" already exists for this user.`);
        setLoading(false);
        return;
      }

      await LearningProgressService.createProgress(formData);
      alert('Learning Progress created!');

      setFormData({
        userId: '',
        progressName: '',
        newSkills: '',
        title: '',
        description: '',
        resources: '',
        progressPercentage: 0,
        tasks: [],
      });
      setTaskInput('');
    } catch (err) {
      console.error(err);
      alert('Error creating progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Learning Progress
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="User ID"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Progress Name"
          name="progressName"
          value={formData.progressName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="New Skills"
          name="newSkills"
          value={formData.newSkills}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Resources"
          name="resources"
          value={formData.resources}
          onChange={handleChange}
          required
        />

        <Box display="flex" gap={2} alignItems="center" mt={2}>
          <TextField
            label="New Task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddTask}>
            Add Task
          </Button>
        </Box>

        <Box mt={2}>
          {formData.tasks.map((task, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>{task.title}</Typography>
              <IconButton color="error" onClick={() => handleRemoveTask(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Box>

        {/* <Box sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            Progress: {formData.progressPercentage}%
          </Typography>
          <LinearProgress variant="determinate" value={formData.progressPercentage} />
        </Box> */}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Progress'}
        </Button>
      </form>
    </Container>
  );
};

export default CreateLearningProgress;
