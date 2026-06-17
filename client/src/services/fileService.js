import axios from 'axios';

const API_URL = 'http://localhost:5000/api/files';

// Helper to construct headers with the current JWT token
const getAuthHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': contentType,
    },
  };
};

/**
 * Uploads a file to the project.
 * @param {File} file - Browser File object
 * @param {string} projectId - ID of the project
 * @param {Function} onUploadProgress - Callback for upload progress tracking
 */
const uploadFile = async (file, projectId, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  const config = getAuthHeaders('multipart/form-data');
  if (onUploadProgress) {
    config.onUploadProgress = onUploadProgress;
  }

  const response = await axios.post(`${API_URL}/upload`, formData, config);
  return response.data.data !== undefined ? response.data.data : response.data;
};

/**
 * Fetches all files belonging to a project.
 */
const getProjectFiles = async (projectId) => {
  const response = await axios.get(`${API_URL}/project/${projectId}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

/**
 * Deletes a file.
 */
const deleteFile = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data !== undefined ? response.data.data : response.data;
};

const fileService = {
  uploadFile,
  getProjectFiles,
  deleteFile,
};

export default fileService;
