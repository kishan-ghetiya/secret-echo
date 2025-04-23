import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  const { token } = res.data;
  if (token) localStorage.setItem('token', token);
  return res.data;
};

export const signup = async (email: string, password: string) => {
  return axios.post(`${API_BASE}/auth/signup`, { email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};
