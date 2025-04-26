import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Checkbox,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LearningProgressService from '../services/LearningProgressService';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const UpdateLearningProgress = () => {
  const { progressId } = useParams();
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState({
    userId: '',
    progressName: '',
    title: '',
    description: '',
    newSkills: '',
    resources: '',
    tasks: [],
  });

  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await LearningProgressService.getAllProgresses();
        const progress = response.data.find((p) => p.id === progressId);
        if (progress) {
          const tasksWithMeta = (progress.tasks || []).map((task) => ({
            ...task,
            isExisting: true,
            wasCheckedInitially: task.completed,
          }));
          setProgressData({ ...progress, tasks: tasksWithMeta });
        } else {
          showSnackbar('Progress not found!', 'error');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress:', error);
        showSnackbar('Error loading progress data', 'error');
        setLoading(false);
      }
    };

    fetchProgress();
  }, [progressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = [...progressData.tasks];
    const task = updatedTasks[index];
    if (!task.isExisting || !task.wasCheckedInitially) {
      task.completed = !task.completed;
      setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
    }
  };

  const handleTaskTitleChange = (index, newTitle) => {
    const updatedTasks = [...progressData.tasks];
    updatedTasks[index].title = newTitle;
    setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      showSnackbar('Task cannot be empty!', 'warning');
      return;
    }
    const newTaskObj = {
      title: newTask.trim(),
      completed: false,
      isExisting: false,
    };
    setProgressData((prevData) => ({
      ...prevData,
      tasks: [...prevData.tasks, newTaskObj],
    }));
    setNewTask('');
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...progressData.tasks];
    updatedTasks.splice(index, 1);
    setProgressData((prevData) => ({ ...prevData, tasks: updatedTasks }));
  };

  const calculateProgressPercentage = (tasks) => {
    if (!tasks.length) return 0;
    const completedCount = tasks.filter((task) => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedTasks = progressData.tasks.map(({ title, completed }) => ({ title, completed }));
    const calculatedPercentage = calculateProgressPercentage(sanitizedTasks);

    try {
      await LearningProgressService.updateProgress(progressId, {
        ...progressData,
        tasks: sanitizedTasks,
        progressPercentage: calculatedPercentage,
      });
      showSnackbar('Progress updated successfully!', 'success');
      setTimeout(() => navigate('/progresses'), 1000);
    } catch (error) {
      console.error('Error updating progress:', error);
      showSnackbar('Failed to update progress.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Typography>Loading progress data...</Typography>;

  const calculatedProgress = calculateProgressPercentage(progressData.tasks);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Update Learning Progress</Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/progresses')}>
            Back
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="User ID" value={progressData.userId} fullWidth disabled />

            <TextField
              label="Progress Name"
              name="progressName"
              value={progressData.progressName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Title"
              name="title"
              value={progressData.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              value={progressData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="New Skills"
              name="newSkills"
              value={progressData.newSkills}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Resources"
              name="resources"
              value={progressData.resources}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Progress Percentage"
              value={`${calculatedProgress}%`}
              fullWidth
              disabled
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tasks
              </Typography>

              {progressData.tasks.map((task, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Tooltip
                    title={
                      task.isExisting && task.wasCheckedInitially
                        ? 'Existing completed tasks cannot be unchecked'
                        : ''
                    }
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskToggle(index)}
                      disabled={task.isExisting && task.wasCheckedInitially}
                    />
                  </Tooltip>

                  <TextField
                    value={task.title}
                    onChange={(e) => handleTaskTitleChange(index, e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, mx: 1 }}
                  />

                  <Tooltip title="Delete task">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveTask(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}

              <Box display="flex" alignItems="center" mt={2}>
                <TextField
                  label="New Task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Tooltip title="Add Task">
                  <IconButton onClick={handleAddTask} color="primary">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Update Progress
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateLearningProgress;
