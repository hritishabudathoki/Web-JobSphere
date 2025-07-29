import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    // If the response has a success field and data field, extract the data
    if (response.data && response.data.success !== undefined) {
      response.data = response.data.data || response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API = {
  // Auth endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  
  // Job endpoints
  getJobs: () => api.get('/jobs'),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  
  // Application endpoints
  getApplications: () => api.get('/applications/user/applications'),
  getAllApplications: () => api.get('/applications/applications'),
  applyForJob: (jobId, applicationData) => api.post(`/applications/jobs/${jobId}/apply`, applicationData),
  updateApplication: (id, applicationData) => api.put(`/applications/${id}/status`, applicationData),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
  
  // User endpoints
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Health check
  healthCheck: () => api.get('/health'),
};

export default API; 