import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/tasks';

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

const getTasks = async (projectId = null) => {
  const url = projectId ? `${API_URL}?projectId=${projectId}` : API_URL;
  const response = await axios.get(url, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getTask = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
