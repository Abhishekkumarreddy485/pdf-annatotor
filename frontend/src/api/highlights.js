// api/highlights.js
import axios from 'axios';
import { getToken } from '../utils/auth';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function authHeaders() {
  const token = getToken();
  return { Authorization: token ? `Bearer ${token}` : '' };
}

export async function createHighlight(payload) {
  const res = await axios.post(`${API}/highlights/`, payload, { headers: authHeaders() });
  return res.data;
}

export async function getHighlights(pdfUuid) {
  const res = await axios.get(`${API}/highlights/${pdfUuid}`, { headers: authHeaders() });
  return res.data;
}

export async function updateHighlight(id, data) {
  const res = await axios.put(`${API}/highlights/${id}`, data, { headers: authHeaders() });
  return res.data;
}

export async function deleteHighlight(id) {
  const res = await axios.delete(`${API}/highlights/${id}`, { headers: authHeaders() });
  return res.data;
}
