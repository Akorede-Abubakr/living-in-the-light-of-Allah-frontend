import axios from 'axios';
import { apiBaseUrl, resolveUploadUrls, restoreUploadUrls } from './config';

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from localStorage token if present
api.interceptors.request.use((config) => {
  if (config.url !== '/ai/chat') config.data = restoreUploadUrls(config.data);
  const token = localStorage.getItem('brightmind_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error response handling
api.interceptors.response.use(
  (response) => {
    if (response.config.url !== '/ai/chat' && response.config.responseType !== 'blob') response.data = resolveUploadUrls(response.data);
    return response;
  },
  (error) => {
    // If 401 unauthenticated, could clear token if not hitting public endpoint
    if (error.response?.status === 401 && error.config?.url !== '/auth/me') {
      // optional clean up
    }
    return Promise.reject(error);
  }
);

export default api;
