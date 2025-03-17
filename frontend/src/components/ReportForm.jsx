// src/components/ReportForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaArrowLeft } from "react-icons/fa";

const ReportForm = () => {
  const initialFormState = {
    title: "",
    subjectName: "",
    facultyName: "",
    date: "",
    studentsAttended: "",
    objectives: [""],
    description: "",
    learningOutcomes: "",
    targetYear: "T.E.",
    groupData: { groupA: Array(8).fill(0), groupB: Array(8).fill(0), groupC: Array(8).fill(0), groupD: Array(8).fill(0) },
    feedback: [],
    participationData: { totalStudents: 0, materialProvided: 0, participated: 0 },
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // ✅ Generate and Download Word Report
  const generateWordReport = async (formData) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "PUNE INSTITUTE OF COMPUTER TECHNOLOGY", heading: "Title" }),
            new Paragraph( {text: "Department: Information Technology", bold: true} ),
            new Paragraph(new TextRun({ text: `Academic Year: 2023-2024`, bold: true })),
            new Paragraph(`Subject: ${formData.subjectName}`),
            new Paragraph(`Faculty: ${formData.facultyName}`),
            new Paragraph(`Date: ${formData.date}`),
            new Paragraph(`No. of Students Attended: ${formData.participationData.totalStudents}`),
            new Paragraph(""),
            new Paragraph({ text: "Objectives:", heading: "Heading1" }),
            ...formData.objectives.map((obj) => new Paragraph(obj)),
            new Paragraph(""),
            new Paragraph({ text: "Learning Outcomes:", heading: "Heading1" }),
            new Paragraph(formData.learningOutcomes),
            new Paragraph(""),
            new Paragraph({ text: "Student Feedback Analysis:", heading: "Heading1" }),
            ...formData.feedback.map((fb) => new Paragraph(`Roll No: ${fb.rollNo} - ${fb.expectation}`)),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${formData.title.replace(/\s+/g, "_")}.docx`);
  };

  // ✅ Generate and Download PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Teaching Activity Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Department: Information Technology`, 14, 30);
    doc.text(`Academic Year: 2023-2024`, 14, 36);
    doc.text(`Subject: ${formData.subjectName}`, 14, 42);
    doc.text(`Faculty: ${formData.facultyName}`, 14, 48);
    doc.text(`Date: ${formData.date}`, 14, 54);
    doc.text(`No. of Students Attended: ${formData.participationData.totalStudents}`, 14, 60);

    doc.text("Objectives:", 14, 70);
    formData.objectives.forEach((obj, index) => {
      doc.text(`${index + 1}. ${obj}`, 14, 76 + index * 6);
    });

    doc.text("Learning Outcomes:", 14, 90);
    doc.text(formData.learningOutcomes, 14, 96);

    doc.text("Student Feedback Analysis:", 14, 110);
    formData.feedback.forEach((fb, index) => {
      doc.text(`Roll No: ${fb.rollNo} - ${fb.expectation}`, 14, 116 + index * 6);
    });

    doc.save(`${formData.title.replace(/\s+/g, "_")}.pdf`);
  };

  // ✅ Handle Form Submission and Reset Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/reports", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Report Created:", response.data);

      // ✅ Generate and download reports
      await generateWordReport(formData);
      generatePDFReport();

      // ✅ Reset form after downloading
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
      setFormData(initialFormState);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Report</h2>

        <input
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Subject Name"
          required
          value={formData.subjectName}
          onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
          className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Faculty Name"
          required
          value={formData.facultyName}
          onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
          className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ Participation Data */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <input
            type="number"
            placeholder="Total Students"
            required
            value={formData.participationData.totalStudents}
            onChange={(e) =>
              setFormData({
                ...formData,
                participationData: { ...formData.participationData, totalStudents: e.target.value },
              })
            }
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Material Provided"
            required
            value={formData.participationData.materialProvided}
            onChange={(e) =>
              setFormData({
                ...formData,
                participationData: { ...formData.participationData, materialProvided: e.target.value },
              })
            }
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Students Participated"
            required
            value={formData.participationData.participated}
            onChange={(e) =>
              setFormData({
                ...formData,
                participationData: { ...formData.participationData, participated: e.target.value },
              })
            }
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Objectives */}
        <label className="block mt-4 font-bold text-gray-800">Objectives:</label>
        {formData.objectives.map((objective, index) => (
          <input
            key={index}
            type="text"
            value={objective}
            onChange={(e) => {
              const newObjectives = [...formData.objectives];
              newObjectives[index] = e.target.value;
              setFormData({ ...formData, objectives: newObjectives });
            }}
            className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, objectives: [...formData.objectives, ""] })}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <span className="mr-1">+</span> Add Another Objective
        </button>

        {/* ✅ Learning Outcomes */}
        <label className="block mt-4 font-bold text-gray-800">Learning Outcomes:</label>
        <textarea
          value={formData.learningOutcomes}
          onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
          className="block w-full p-3 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />

        {/* ✅ Submit Button */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-3">
            <Link 
              to="/dashboard" 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </Link>
            <button 
              type="button" 
              onClick={handleReset}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              Reset Form
            </button>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Generate Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
