import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Viewer from './pages/Viewer';
import Header from './components/Header';
import { getToken } from './utils/auth';

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/viewer/:uuid" element={<PrivateRoute><Viewer /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
