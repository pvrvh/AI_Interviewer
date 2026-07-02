import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Interview APIs
export const interviewAPI = {
  getAll: () => api.get('/interviews'),
  getById: (id) => api.get(`/interviews/${id}`),
  create: (data) => api.post('/interviews', data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

// Question APIs
export const questionAPI = {
  generate: (interviewId, count) => api.post('/questions/generate', { interview_id: interviewId, count }),
  getById: (id) => api.get(`/questions/${id}`),
  submitAnswer: (id, answerText) => api.post(`/questions/${id}/answer`, { answer_text: answerText }),
  getHints: (id) => api.get(`/questions/${id}/hints`),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProgress: () => api.get('/analytics/progress'),
  getTips: (category) => api.get(`/analytics/tips/${category}`),
  getInterviewReport: (id) => api.get(`/analytics/interview/${id}/report`),
};

export default api;
