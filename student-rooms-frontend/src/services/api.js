import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response);
      toast.error(error.response.data.message || 'An error occurred.');

      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error Request:", error.request);
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
      toast.error('An error occurred while setting up the request.');
    }
    return Promise.reject(error);
  }
);

export default api;