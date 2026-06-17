import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clients';

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

const getClients = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const getClient = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const createClient = async (clientData) => {
  const response = await axios.post(API_URL, clientData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const updateClient = async (id, clientData) => {
  const response = await axios.put(`${API_URL}/${id}`, clientData, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const clientService = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};

export default clientService;
