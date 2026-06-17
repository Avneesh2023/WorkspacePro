import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

// Helper to construct headers with the current JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getRecentProjects = async () => {
  const response = await axios.get(`${API_URL}/recent-projects`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getRecentTasks = async () => {
  const response = await axios.get(`${API_URL}/recent-tasks`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getProjectStatusStats = async () => {
  const response = await axios.get(`${API_URL}/project-status`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getTaskStatusStats = async () => {
  const response = await axios.get(`${API_URL}/task-status`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const dashboardService = {
  getDashboardStats,
  getRecentProjects,
  getRecentTasks,
  getProjectStatusStats,
  getTaskStatusStats
};

export default dashboardService;
