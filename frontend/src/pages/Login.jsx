// pages/Login.jsx
import React, { useState } from 'react';
import { login } from '../api/auth';
import { setToken, setUser } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const data = await login(form);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  return (
    <div className="card auth-card">
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="btn" type="submit">Login</button>
      </form>
      <div className="muted">Don't have an account? <Link to="/register">Register</Link></div>
    </div>
  );
}
