// pages/Register.jsx
import React, { useState } from 'react';
import { register } from '../api/auth';
import { setToken, setUser } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const data = await register(form);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  return (
    <div className="card auth-card">
      <h2>Register</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={handleSubmit}>
        <label>Name (optional)</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <label>Email</label>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="btn" type="submit">Register</button>
      </form>
      <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}
