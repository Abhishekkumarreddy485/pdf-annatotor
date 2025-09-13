// components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../utils/auth';

export default function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">PDF Annotator</Link>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="user-label">Hello, {user.name || user.email}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
