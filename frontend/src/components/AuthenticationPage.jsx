import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const AuthenticationPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isSignup ? "/api/register" : "/api/login";
    try {
      const { data } = await axios.post(`http://localhost:8000${endpoint}`, formData);
      if (!isSignup) {
        localStorage.setItem('token', data.token);
        login(data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Signup successful! Please login.");
        setIsSignup(false);
      }
    } catch (error) {
      alert("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Teaching Activity Report System</h1>
      
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 w-full p-2 border rounded"
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="pl-10 w-full p-2 border rounded"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Create a password"
                className="pl-10 w-full p-2 border rounded"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 w-full p-2 border rounded"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded text-lg font-medium hover:bg-blue-700 transition"
          >
            {isSignup ? <FaUserPlus /> : <FaSignInAlt />}
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationPage;
