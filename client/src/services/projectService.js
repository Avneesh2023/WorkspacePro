import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/projects';

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

const getProjects = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const updateProject = async (id, projectData) => {
  const response = await axios.put(`${API_URL}/${id}`, projectData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;
