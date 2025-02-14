// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold">My Reports</h1>
      <button className="mt-4 p-2 bg-blue-500 text-white rounded">
        <Link to="/create-report">+ Create New Report</Link>
      </button>
      <ul>
        {reports.map(report => (
          <li key={report._id} className="border p-4 my-2 rounded">
            <Link to={`/view-report/${report._id}`} className="text-blue-600">{report.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
