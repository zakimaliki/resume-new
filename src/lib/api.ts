import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3001'; // Change back to empty string for local API routes
export const API_BASE_URL = 'https://resume-api-pi.vercel.app'; // Change back to empty string for local API routes


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Add request interceptor to include auth token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 