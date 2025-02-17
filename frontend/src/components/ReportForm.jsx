// src/components/ReportForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
            new Paragraph(new TextRun({ text: `Department: Information Technology`, bold: true })),
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

  // ✅ Handle Form Submission and Reset Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/reports", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Report Created:", response.data);

      // ✅ Generate and download report
      await generateWordReport(formData);

      // ✅ Reset form after downloading
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Create New Report</h2>

        <input
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="block w-full p-2 my-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject Name"
          required
          value={formData.subjectName}
          onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
          className="block w-full p-2 my-2 border rounded"
        />
        <input
          type="text"
          placeholder="Faculty Name"
          required
          value={formData.facultyName}
          onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
          className="block w-full p-2 my-2 border rounded"
        />
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="block w-full p-2 my-2 border rounded"
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
            className="p-2 border rounded"
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
            className="p-2 border rounded"
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
            className="p-2 border rounded"
          />
        </div>

        {/* ✅ Objectives */}
        <label className="block mt-4 font-bold">Objectives:</label>
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
            className="block w-full p-2 my-2 border rounded"
          />
        ))}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, objectives: [...formData.objectives, ""] })}
          className="text-blue-500 underline"
        >
          + Add Another Objective
        </button>

        {/* ✅ Learning Outcomes */}
        <label className="block mt-4 font-bold">Learning Outcomes:</label>
        <textarea
          value={formData.learningOutcomes}
          onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
          className="block w-full p-2 my-2 border rounded"
        />

        {/* ✅ Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Generate Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
