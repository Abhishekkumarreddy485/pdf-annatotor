import axios from 'axios';
import { getToken } from '../utils/auth';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function authHeaders() {
  const token = getToken();
  return { Authorization: token ? `Bearer ${token}` : '' };
}

// Upload PDF
export async function uploadPdf(file, onUploadProgress) {
  const form = new FormData();
  form.append('file', file);

  const res = await axios.post(`${API}/pdfs/upload`, form, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return res.data;
}

// List PDFs
export async function listPdfs() {
  const res = await axios.get(`${API}/pdfs/`, { headers: authHeaders() });
  return res.data;
}

// ✅ Get PDF blob URL
export async function getPdf(uuid) {
  const res = await axios.get(`${API}/pdfs/${uuid}/download?cacheBust=${Date.now()}`, {
    headers: authHeaders(),
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}


// Rename PDF
export async function renamePdf(uuid, filename) {
  const res = await axios.put(`${API}/pdfs/${uuid}/rename`, { filename }, { headers: authHeaders() });
  return res.data;
}

// Delete PDF
export async function deletePdf(uuid) {
  const res = await axios.delete(`${API}/pdfs/${uuid}`, { headers: authHeaders() });
  return res.data;
}
