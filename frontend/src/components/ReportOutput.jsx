// src/components/ReportOutput.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const ReportOutput = () => {
  const [report, setReport] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, [id]);

  if (!report) return <p>Loading report...</p>;

  const generateWordReport = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: report.title, heading: "Title" }),
          new Paragraph(new TextRun({ text: `Subject: ${report.subjectName}`, bold: true })),
          new Paragraph(`Faculty: ${report.facultyName}`),
          new Paragraph(`Date: ${report.date}`),
          new Paragraph(`Students Attended: ${report.participationData.totalStudents}`),
          new Paragraph(""),
          new Paragraph({ text: "Objectives:", heading: "Heading1" }),
          ...report.objectives.map(obj => new Paragraph(obj)),
          new Paragraph(""),
          new Paragraph({ text: "Learning Outcomes:", heading: "Heading1" }),
          new Paragraph(report.learningOutcomes),
          new Paragraph(""),
          new Paragraph({ text: "Student Feedback Analysis:", heading: "Heading1" }),
          ...report.feedback.map(fb => new Paragraph(`Roll No: ${fb.rollNo} - ${fb.expectation}`)),
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

      <button onClick={generateWordReport} className="mt-4 bg-green-500 text-white p-2 rounded">
        Download Report
      </button>
    </div>
  );
};

export default ReportOutput;
