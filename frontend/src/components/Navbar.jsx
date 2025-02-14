// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between">
      <Link to="/dashboard" className="text-xl font-bold">Report Generator</Link>
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="text-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
