import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from localStorage token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('brightmind_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 unauthenticated, could clear token if not hitting public endpoint
    if (error.response?.status === 401 && error.config?.url !== '/auth/me') {
      // optional clean up
    }
    return Promise.reject(error);
  }
);

export default api;
