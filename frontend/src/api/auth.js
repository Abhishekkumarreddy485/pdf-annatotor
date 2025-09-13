// api/auth.js
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function register(data) {
  const res = await axios.post(`${API}/auth/register`, data);
  return res.data;
}

export async function login(data) {
  const res = await axios.post(`${API}/auth/login`, data);
  return res.data;
}

export async function verifyToken(token) {
  const res = await axios.post(`${API}/auth/verify`, { token });
  return res.data;
}
