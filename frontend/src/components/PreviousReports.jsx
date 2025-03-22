import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { pdf } from "@react-pdf/renderer";
import { FaDownload, FaFilePdf, FaFileWord, FaArrowLeft, FaChalkboardTeacher, FaChartBar } from 'react-icons/fa';
import ReportPDF from "./ReportPDF";
import ReportPDAPDFContainer from "./ReportPDAPDFContainer";

const PreviousReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('teaching'); // 'teaching' or 'pda'
  const [filter, setFilter] = useState('all'); // 'all', 'teaching', or 'pda'
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug token
      
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data); // Debug API response
      // Map reports and add a type field (Default to 'teaching' for existing reports)
      const processedReports = Array.isArray(response.data) 
        ? response.data.map(report => ({
            ...report,
            reportType: report.reportType || 'teaching' // Default to 'teaching' if not specified
          }))
        : [];
        
      setReports(processedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Show more detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setError(`Error: ${error.response.data.message || 'Failed to fetch reports'}`);
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    fetchReports();
  };

  const handleDownload = async (reportId, format) => {
    try {
      console.log(`Starting download for report ID: ${reportId}, format: ${format}`);
      setDownloading(true);
      setDownloadStatus(`Preparing ${format.toUpperCase()} file...`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Fetching report data from server...');
      const response = await axios.get(`http://localhost:8000/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const reportData = response.data;
      const isPDA = reportData.reportType === 'pda';
      
      console.log('Report data received:', {
        id: reportData._id,
        title: reportData.title,
        type: reportData.reportType,
        isPDA,
        hasChartImages: !!reportData.chartImages && reportData.chartImages.length > 0,
        chartImagesCount: reportData.chartImages?.length || 0
      });
      
      if (format === 'pdf') {
        try {
          console.log('Starting PDF generation process');
          setDownloadStatus('Generating PDF document...');
          
          // Log chart image information for debugging
          if (reportData.chartImages) {
            console.log(`Chart images available: ${reportData.chartImages.length}`);
            if (reportData.chartImages.length > 0) {
              // Log first chart image type for debugging
              if (typeof reportData.chartImages[0] === 'string') {
                console.log('Chart image format: string (data URL)');
              } else {
                console.log('Chart image format: object', Object.keys(reportData.chartImages[0]));
              }
            }
          } else {
            console.log('No chart images in the report data');
          }
          
          // Create the PDF document directly
          const pdfDoc = isPDA 
            ? <ReportPDAPDFContainer data={reportData} />
            : <ReportPDF data={reportData} />;
          
          console.log('PDF component created, generating blob...');
          const asPdf = pdf();
          asPdf.updateContainer(pdfDoc);
          const blob = await asPdf.toBlob();
          console.log('PDF blob created successfully');
          
          // Create a filename with appropriate prefix
          const filePrefix = isPDA ? 'PDA_Report_' : 'Teaching_Report_';
          const fileName = `${filePrefix}${reportData.title.replace(/\s+/g, "_")}.pdf`;
          console.log(`Saving PDF as: ${fileName}`);
          
          // Save the file
          saveAs(blob, fileName);
          console.log('File saved');
          
          // Show success message
          setDownloadStatus('PDF downloaded successfully!');
          
          // Clear the status after a delay
          setTimeout(() => {
            setDownloading(false);
            setDownloadStatus('');
          }, 2000);
        } catch (pdfError) {
          console.error('Error generating PDF:', pdfError);
          setDownloadStatus(`Error generating PDF: ${pdfError.message || 'Unknown error'}`);
          setTimeout(() => {
            setDownloading(false);
            setDownloadStatus('');
          }, 3000);
        }
      } else if (format === 'docx') {
        // Generate Word document
        console.log('Starting Word document generation');
        setDownloadStatus('Generating Word document...');
        await generateWordReport(reportData);
        console.log('Word document created and downloaded');
        setDownloadStatus('Word document downloaded successfully!');
        
        // Clear the status after a delay
        setTimeout(() => {
          setDownloading(false);
          setDownloadStatus('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      let errorMsg = `Failed to download report: ${error.message}`;
      if (error.response) {
        errorMsg += ` (${error.response.status}: ${error.response.data.message || error.response.statusText})`;
      }
      setDownloadStatus(errorMsg);
      
      // Clear the status after a delay
      setTimeout(() => {
        setDownloading(false);
        setDownloadStatus('');
      }, 3000);
    }
  };

  // Generate and Download Word Report
  const generateWordReport = async (reportData) => {
    const sections = [];
    
    // Common header section
    const commonSection = {
      properties: {},
      children: [
        new Paragraph({ text: "PUNE INSTITUTE OF COMPUTER TECHNOLOGY", heading: "Title" }),
        new Paragraph({ text: "Department: Information Technology", bold: true }),
        new Paragraph(new TextRun({ text: `Date: ${reportData.date || 'N/A'}`, bold: true })),
      ]
    };
    
    if (reportData.reportType === 'pda') {
      // PDA Report specific structure
      commonSection.children.push(
        new Paragraph({ text: reportData.title || 'N/A', heading: "Heading1" }),
        new Paragraph(`Target Audience: ${reportData.targetAudience || 'N/A'}`),
        new Paragraph(`Organized By: ${reportData.organizedBy || 'N/A'}`),
        new Paragraph(`Venue: ${reportData.venue || 'N/A'}`),
        new Paragraph(`Time: ${reportData.time || 'N/A'}`),
        new Paragraph(`Number of Participants: ${reportData.participants || 'N/A'}`),
        new Paragraph(""),
        new Paragraph({ text: "Faculty Members:", heading: "Heading2" })
      );
      
      // Add faculty members
      if (reportData.faculty && reportData.faculty.length > 0) {
        reportData.faculty.forEach((faculty, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${faculty}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Student Members:", heading: "Heading2" })
      );
      
      // Add student members
      if (reportData.students && reportData.students.length > 0) {
        reportData.students.forEach((student, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${student}`));
        });
      }
      
      // Add other PDA-specific sections
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Objectives:", heading: "Heading2" })
      );
      
      if (reportData.objectives && reportData.objectives.length > 0) {
        reportData.objectives.forEach((obj, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${obj}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Execution:", heading: "Heading2" }),
        new Paragraph(reportData.execution || 'N/A'),
        new Paragraph(""),
        new Paragraph({ text: "Outcomes:", heading: "Heading2" })
      );
      
      if (reportData.outcomes && reportData.outcomes.length > 0) {
        reportData.outcomes.forEach((outcome, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${outcome}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Impact Analysis:", heading: "Heading2" })
      );
      
      if (reportData.impactAnalysis && reportData.impactAnalysis.length > 0) {
        reportData.impactAnalysis.forEach((impact, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${impact}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Feedback Analysis:", heading: "Heading2" })
      );
      
      if (reportData.feedback && reportData.feedback.length > 0) {
        reportData.feedback.forEach((fb, index) => {
          if (typeof fb === 'string') {
            commonSection.children.push(new Paragraph(`${index + 1}. ${fb}`));
          }
        });
      }
      
    } else {
      // Teaching Report specific structure
      commonSection.children.push(
        new Paragraph(new TextRun({ text: `Academic Year: ${reportData.academicYear || '2023-2024'}`, bold: true })),
        new Paragraph(`Subject: ${reportData.subjectName || reportData.title || 'N/A'}`),
        new Paragraph(`Faculty: ${reportData.facultyName || 'N/A'}`),
        new Paragraph(`No. of Students Attended: ${reportData.participationData?.totalStudents || reportData.studentsAttended || 'N/A'}`),
        new Paragraph(""),
        new Paragraph({ text: "Objectives:", heading: "Heading1" })
      );
      
      if (reportData.objectives && reportData.objectives.length > 0) {
        reportData.objectives.forEach((obj) => {
          commonSection.children.push(new Paragraph(obj));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Learning Outcomes:", heading: "Heading1" }),
        new Paragraph(reportData.learningOutcomes || 'N/A'),
        new Paragraph(""),
        new Paragraph({ text: "Student Feedback Analysis:", heading: "Heading1" })
      );
      
      if (reportData.feedback && reportData.feedback.length > 0) {
        reportData.feedback.forEach((fb) => {
          if (typeof fb === 'string') {
            commonSection.children.push(new Paragraph(fb));
          } else {
            commonSection.children.push(new Paragraph(`Roll No: ${fb.rollNo} - ${fb.expectation}`));
          }
        });
      }
    }
    
    sections.push(commonSection);
    
    const doc = new Document({
      sections: sections,
    });

    const blob = await Packer.toBlob(doc);
    const filePrefix = reportData.reportType === 'pda' ? 'PDA_Report_' : 'Teaching_Report_';
    saveAs(blob, `${filePrefix}${reportData.title.replace(/\s+/g, "_")}.docx`);
  };

  const getReportTypeIcon = (type) => {
    if (type === 'pda') {
      return <FaChartBar className="mr-1 text-purple-600" title="PDA Report" />;
    }
    return <FaChalkboardTeacher className="mr-1 text-blue-600" title="Teaching Report" />;
  };

  const getReportTypeText = (type) => {
    if (type === 'pda') {
      return <span className="text-purple-600 font-medium">PDA Report</span>;
    }
    return <span className="text-blue-600 font-medium">Teaching Report</span>;
  };

  // Filter reports by type
  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.reportType === filter);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <button 
          onClick={handleRefresh} 
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Previous Reports</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="text-red-700 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}
      
      {downloadStatus && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <p>{downloadStatus}</p>
          {downloading && <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No reports found.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/create-report" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Create Teaching Report
            </Link>
            <Link 
              to="/create-pda-report" 
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Create PDA Report
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Found {reports.length} reports</p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Filter by type:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="teaching">Teaching Reports</option>
                <option value="pda">PDA Reports</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  {/* Only show Subject/Event header for all reports or when filtering by teaching */}
                  {filter !== 'pda' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject/Event</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={filter === 'pda' ? "4" : "5"} className="px-6 py-4 text-center text-gray-500">
                      No {filter} reports found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getReportTypeIcon(report.reportType)}
                          {getReportTypeText(report.reportType)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      </td>
                      {/* Only show Subject/Event cell for teaching reports or when not filtered to PDA */}
                      {(report.reportType !== 'pda' || filter !== 'pda') && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{report.subjectName || report.targetAudience || '-'}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDownload(report._id, 'pdf')}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Download as PDF"
                          >
                            <FaFilePdf className="mr-1" /> PDF
                          </button>
                          <button
                            onClick={() => handleDownload(report._id, 'docx')}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Download as Word"
                          >
                            <FaFileWord className="mr-1" /> Word
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PreviousReports; 