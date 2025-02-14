// src/components/ReportForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: '', subjectName: '', facultyName: '', date: '', studentsAttended: '',
    objectives: [''], description: '', learningOutcomes: '', targetYear: 'T.E.',
    groupData: { groupA: Array(8).fill(0), groupB: Array(8).fill(0), groupC: Array(8).fill(0), groupD: Array(8).fill(0) },
    feedback: [],
    participationData: { totalStudents: 0, materialProvided: 0, participated: 0 }
  });

  const navigate = useNavigate();

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/reports', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      navigate(`/view-report/${response.data._id}`); // Redirect to Report Output Page
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Create New Report</h2>

        <input type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="block w-full p-2 my-2 border rounded" />
        <input type="text" placeholder="Subject Name" required value={formData.subjectName} onChange={(e) => setFormData({...formData, subjectName: e.target.value})} className="block w-full p-2 my-2 border rounded" />
        <input type="text" placeholder="Faculty Name" required value={formData.facultyName} onChange={(e) => setFormData({...formData, facultyName: e.target.value})} className="block w-full p-2 my-2 border rounded" />
        <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="block w-full p-2 my-2 border rounded" />
        
        {/* Participation Data */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <input type="number" placeholder="Total Students" required value={formData.participationData.totalStudents} onChange={(e) => setFormData({...formData, participationData: { ...formData.participationData, totalStudents: e.target.value }})} className="p-2 border rounded" />
          <input type="number" placeholder="Material Provided" required value={formData.participationData.materialProvided} onChange={(e) => setFormData({...formData, participationData: { ...formData.participationData, materialProvided: e.target.value }})} className="p-2 border rounded" />
          <input type="number" placeholder="Students Participated" required value={formData.participationData.participated} onChange={(e) => setFormData({...formData, participationData: { ...formData.participationData, participated: e.target.value }})} className="p-2 border rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Generate Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
