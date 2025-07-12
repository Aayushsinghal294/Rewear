// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const userAPI = {
  syncUser: (userData) => api.post('/users/sync', userData),
  getProfile: (clerkId) => api.get(`/users/profile/${clerkId}`),
  getStats: (clerkId) => api.get(`/users/stats/${clerkId}`),
};

export const itemAPI = {
  getAllItems: (params) => api.get('/items', { params }),
  createItem: (itemData) => api.post('/items', itemData),
  getUserItems: (clerkId) => api.get(`/items/user/${clerkId}`),
};