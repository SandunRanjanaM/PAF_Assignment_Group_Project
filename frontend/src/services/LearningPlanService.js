// src/services/LearningPlanService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5021/api/LearningPlan';

const createLearningPlan = (planData) => {
  return axios.post(BASE_URL, planData);
};

const getAllPlans = () => {
  return axios.get(BASE_URL);
};

const getPlansByUser = (userId) => {
  return axios.get(`${BASE_URL}/user/${userId}`);
};

const getPlansByProgressName = (progressName) => {
  return axios.get(`${BASE_URL}/progress/${progressName}`);
};

const getPlanById = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

const getLatestPlan = (userId, progressName) => {
  return axios.get(`${BASE_URL}/latest/${userId}/${progressName}`);
};

const updatePlan = (id, updatedData) => {
  return axios.put(`${BASE_URL}/${id}`, updatedData);
};

const deletePlan = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

const LearningPlanService = {
  createLearningPlan,
  getAllPlans,
  getPlansByUser,
  getPlansByProgressName,
  getPlanById,
  getLatestPlan,
  updatePlan,
  deletePlan,
};

export default LearningPlanService;
