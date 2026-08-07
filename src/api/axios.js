// src/api/axios.js
// A single Axios instance used throughout the app to talk to the backend.

import axios from "axios";

// The backend URL - during local development this points to localhost.
// After deployment, this will be replaced with the live Render backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor: automatically attaches the JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
