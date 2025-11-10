import axios from 'axios';

export const API_BASE = 'http://localhost:4000/api';

export const api = axios.create({ baseURL: API_BASE});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    JSON.parse(localStorage.getItem('user') || 'null')?.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirigir si vence o falta el token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}




