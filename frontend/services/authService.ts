import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  const { token } = res.data;
  if (token) localStorage.setItem('token', token);
  return res.data;
};

export const signup = async (username: string, email: string, password: string) => {
  return api.post('/auth/signup', { username, email, password });
};

export const fetchMessages = async (page: number) => {
  const params = { page };
  return api.get("/messages", { params });
};

export const sendMessage = async (message: { sender: string; message: string }) => {
  return api.post('/messages', message);
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};
