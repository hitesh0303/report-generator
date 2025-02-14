// src/components/AuthenticationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthenticationPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/api/register' : '/api/login';
    try {
      const { data } = await axios.post(`http://localhost:8000${endpoint}`, formData);
      if (!isSignup) {
        login(formData.email, formData.password);
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert('Signup successful! Please login.');
        setIsSignup(false);
      }
    } catch (error) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow rounded">
        <h2 className="text-2xl font-bold">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required className="block w-full p-2 my-2 border rounded" />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required className="block w-full p-2 my-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">{isSignup ? 'Sign Up' : 'Login'}</button>
        <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-sm text-blue-600 mt-2">
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthenticationPage;
