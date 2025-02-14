// src/components/ReportOutput.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ReportOutput = () => {
  const [report, setReport] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };
    fetchReport();
  }, [id]);

  if (!report) return <p>Loading report...</p>;

  // Generate Word Document
  const generateWordReport = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: report.title, heading: "Title" }),
          new Paragraph(new TextRun({ text: `Subject: ${report.subjectName}`, bold: true })),
          new Paragraph(`Faculty: ${report.facultyName}`),
          new Paragraph(`Date: ${report.date}`),
          new Paragraph(`Total Students: ${report.participationData.totalStudents}`),
          new Paragraph(`Material Provided: ${report.participationData.materialProvided}`),
          new Paragraph(`Students Participated: ${report.participationData.participated}`),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${report.title.replace(/\s+/g, '_')}.docx`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{report.title}</h1>
      <p>Subject: {report.subjectName}</p>
      <p>Faculty: {report.facultyName}</p>
      <p>Students Attended: {report.participationData.totalStudents}</p>

      {/* Feedback Chart */}
      <h2 className="text-2xl font-bold mt-6">Feedback Analysis</h2>
      <BarChart width={600} height={300} data={report.feedback}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rollNo" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expectation" fill="#8884d8" />
      </BarChart>

      <button onClick={generateWordReport} className="mt-4 bg-green-500 text-white p-2 rounded">Download Report</button>
    </div>
  );
};

export default ReportOutput;
