// src/services/LearningProgressService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5021/api/LearningProgress';

const createProgress = async (data) => {
  return await axios.post(API_BASE_URL, data);
};

const getAllProgresses = async () => {
  return await axios.get(API_BASE_URL);
};

const deleteProgress = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`);
};

const updateProgress = async (id, data) => {
  return await axios.put(`${API_BASE_URL}/${id}`, data);
};

const checkDuplicateProgress = async (userId, progressName) => {
  return await axios
    .get(`${API_BASE_URL}/check-duplicate`, {
      params: { userId, progressName },
    })
    .then((res) => res.data.exists);
};

const LearningProgressService = {
  createProgress,
  getAllProgresses,
  deleteProgress,
  updateProgress,
  checkDuplicateProgress,
};

export default LearningProgressService;
