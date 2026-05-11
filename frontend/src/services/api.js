// src/services/api.js
// Axios instance configured with environment variable for backend URL.
// Vite exposes env variables prefixed with VITE_ to the client side.

import axios from 'axios';

// The base URL for the backend API. Define VITE_BACKEND_URL in .env files.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  // You can set common headers here, e.g., JSON content type.
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable sending cookies for auth if backend uses sessions.
  withCredentials: true,
});

// Attach auth token from localStorage to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: interceptors for request/response handling (e.g., auth token)
api.interceptors.request.use(
  (config) => {
    // Example: attach auth token from localStorage if present
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling can be added here.
    return Promise.reject(error);
  }
);

export default api;
