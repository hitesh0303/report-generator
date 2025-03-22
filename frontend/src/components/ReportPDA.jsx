import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { FaArrowLeft, FaFilePdf, FaFileWord, FaUpload, FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";
import ReportPDAPDFContainer from "./ReportPDAPDFContainer";
import FeedbackCharts from "./FeedbackCharts";
import { processExcelData, prepareChartData } from "../utils/feedbackAnalysis";
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import ErrorBoundary from "./ErrorBoundary";

const ReportPDA = () => {
  const initialFormState = {
    title: "A Knowledge Assessment Quiz-Internship and Placement Preparation",
    targetAudience: "Third Year and Second Year Students of IT Department",
    date: "",
    time: "11:00 am to 12:00 pm",
    organizedBy: "Professional Development Activity Committee",
    institution: "Pune Institute of Computer Technology",
    venue: "Google form",
    fee: "0",
    participants: "230",
    faculty: [
      { name: "Mr. Sachin Pande", role: "Head – Professional Development Committee" },
      { name: "Mrs. Amruta Patil", role: "Member of PDA" },
      { name: "Mr. Vinit Tribhuvan", role: "Member of PDA" }
    ],
    students: ["Rudraksh Khandelwal", "Mikhiel Benji", "Akshay Raut", "Om Patil"],
    objectives: [
      "Foster a competitive yet supportive environment to encourage skill showcasing and mutual learning.",
      "Assess participants' skills dynamically and challenge them in a lively quiz setting.",
      "Facilitate in-depth domain knowledge acquisition essential for success in future internships and placements."
    ],
    execution: "A knowledge assessment quiz to help students in placement and internship selection process, was held on the specified date from 9:00pm. The quiz focused on data structures and algorithms.",
    outcomes: [
      "Participants will demonstrate improved proficiency in the assessed skills, indicating growth and development in their knowledge areas.",
      "Attendees will acquire a deeper understanding of the domain, enhancing their expertise and readiness for future internship and placement opportunities.",
      "The top scorers will be honored with a special gift, fostering a sense of achievement and motivation among participants."
    ],
    impactAnalysis: [
      "Enhanced problem solving and critical thinking",
      "Preparation for future tests for internships and placements",
      "Increased awareness of knowledge gaps",
      "Overall readiness for internships and placements"
    ],
    feedback: [
      "This test was really helpful for our Placement preparation",
      "Very good quality questions!",
      "Great experience",
      "Keep taking similar quizes",
      "Quiz level was medium and excellent quality of questions.",
      "Quiz is good but its too lengthy",
      "Best quiz ever!!"
    ],
    chartImages: [],
    excelData: [],
    feedbackData: [] // Store processed feedback data
  };

  const [formData, setFormData] = useState(initialFormState);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [wordError, setWordError] = useState(null);
  const fileInputRef = useRef(null);
  const excelInputRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const chartsContainerRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [chartImages, setChartImages] = useState([]);
  const feedbackInputRef = useRef(null);

  // Initialize dummy data for Excel and chart images
  useEffect(() => {
    // Add dummy Excel data
    const dummyData = Array.from({ length: 10 }, (_, i) => ({
      'Sr No': i + 1,
      'Roll Number': `IT_${20000 + i}`,
      'Name': `Student ${i + 1}`,
      'Marks': Math.floor(Math.random() * 50) + 50
    }));
    
    // Add dummy chart images with titles but without real image data
    // Since we're displaying text placeholders rather than actual images
    const dummyChartImages = [
      { 
        title: "Performance Distribution",
        // We won't use src anymore as we're showing text placeholders in the PDF
      },
      { 
        title: "Topic Wise Analysis",
        // We won't use src anymore as we're showing text placeholders in the PDF
      }
    ];
    
    setFormData(prevData => ({
      ...prevData,
      excelData: dummyData,
      chartImages: dummyChartImages
    }));
  }, []);

  // Handle image upload - now just for reference, not used in UI
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = [...imageFiles];
    
    files.forEach(file => {
      const imageUrl = URL.createObjectURL(file);
      newImageFiles.push({
        file,
        preview: imageUrl,
        title: "Chart " + (newImageFiles.length + 1)
      });
    });
    
    setImageFiles(newImageFiles);
    
    // Update formData with image info
    setFormData({
      ...formData,
      chartImages: newImageFiles.map(img => ({ 
        src: img.preview,
        title: img.title
      }))
    });
  };

  // Handle Excel file upload - now just for reference, not used in UI
  const handleExcelUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExcelFile(file);
      
      // In a real app, you would parse the Excel file here
      // For now, we'll just simulate with dummy data
      const dummyData = Array.from({ length: 10 }, (_, i) => ({
        'Sr No': i + 1,
        'Roll Number': `IT_${20000 + i}`,
        'Name': `Student ${i + 1}`,
        'Marks': Math.floor(Math.random() * 50) + 50
      }));
      
      setFormData({
        ...formData,
        excelData: dummyData
      });
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles];
    URL.revokeObjectURL(newImageFiles[index].preview);
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    setFormData({
      ...formData,
      chartImages: newImageFiles.map(img => ({ 
        src: img.preview,
        title: img.title
      }))
    });
  };

  // Handle updating image title
  const handleImageTitleChange = (index, newTitle) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index].title = newTitle;
    setImageFiles(newImageFiles);
    
    setFormData({
      ...formData,
      chartImages: newImageFiles.map(img => ({ 
        src: img.preview,
        title: img.title
      }))
    });
  };

  // Handle Excel file upload for feedback data
  const handleFeedbackUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExcelFile(file);
      setIsProcessingFeedback(true);
      
      try {
        // Process the Excel file
        const processedData = await processExcelData(file);
        
        // Prepare data for charts
        const preparedChartData = prepareChartData(processedData);
        setChartData(preparedChartData);
        
        // Update form data with feedback data
        setFormData({
          ...formData,
          feedbackData: processedData
        });
      } catch (error) {
        console.error("Error processing feedback file:", error);
        alert("Failed to process feedback file. Please check the format and try again.");
      } finally {
        setIsProcessingFeedback(false);
      }
    }
  };

  // Capture charts as images
  const captureCharts = async () => {
    setStatusMessage('Starting to capture charts...');
    if (!chartsContainerRef.current) {
      console.error('Chart container ref is not available');
      setStatusMessage('Error: Chart container not found');
      return;
    }

    try {
      // Clear any previous chart images
      setChartImages([]);
      const chartImagesArray = [];
      
      // Find all question containers
      const chartItemElements = document.querySelectorAll('[id^="chart-item-"]');
      setStatusMessage(`Found ${chartItemElements.length} chart items to capture`);
      
      if (chartItemElements.length === 0) {
        setStatusMessage('No chart items found to capture');
        return;
      }

      // Process each question container separately
      for (let i = 0; i < chartItemElements.length; i++) {
        const itemElement = chartItemElements[i];
        const questionHeader = itemElement.querySelector('h4').textContent;
        setStatusMessage(`Capturing charts for question: ${questionHeader}...`);
        
        // Capture the entire chart item (both bar and pie charts together)
        try {
          // Add temporary styling to make content more compact for capture
          const originalStyle = itemElement.getAttribute('style') || '';
          itemElement.style.backgroundColor = '#ffffff';
          itemElement.style.padding = '15px';
          itemElement.style.boxShadow = 'none';
          itemElement.style.border = 'none';
          itemElement.style.margin = '0';
          
          // Get content measurements to crop out whitespace
          const chartGrid = itemElement.querySelector('.grid');
          if (chartGrid) {
            chartGrid.style.gap = '10px'; // Reduce gap between charts
          }
          
          const canvas = await html2canvas(itemElement, {
            scale: 2.5, // High quality but reasonable size
            logging: true,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc, element) => {
              // Clean up the cloned element for better capture
              element.style.width = `${itemElement.offsetWidth}px`;

              // Remove any excessive padding/margins from child elements
              Array.from(element.querySelectorAll('*')).forEach(el => {
                if (el.style) {
                  el.style.margin = '0px';
                  el.style.marginTop = '5px';
                  el.style.marginBottom = '5px';
                }
              });
              
              // Make chart containers more compact
              const chartContainers = element.querySelectorAll('[id^="bar-chart-container-"], [id^="pie-chart-container-"]');
              chartContainers.forEach(container => {
                if (container.style) {
                  container.style.height = '250px';
                }
              });
            }
          });
          
          // Restore original styling
          itemElement.setAttribute('style', originalStyle);
          
          const combinedChartImage = canvas.toDataURL('image/png', 1.0);
          chartImagesArray.push({
            title: questionHeader,
            src: combinedChartImage,
            questionIndex: i,
            type: 'combined'
          });
          
          setStatusMessage(`Successfully captured question ${i+1}: ${questionHeader}`);
        } catch (error) {
          console.error(`Error capturing question ${i+1}:`, error);
          setStatusMessage(`Error capturing question ${i+1}: ${error.message}`);
        }
      }
      
      setStatusMessage(`Successfully captured ${chartImagesArray.length} charts`);
      setChartImages(chartImagesArray);
      
      // Update form data with the chart images
      setFormData({
        ...formData,
        chartImages: chartImagesArray
      });
      
      return chartImagesArray;
    } catch (error) {
      console.error('Error capturing charts:', error);
      setStatusMessage(`Error capturing charts: ${error.message}`);
      return [];
    }
  };

  // Effect to capture charts when they change with better timing
  useEffect(() => {
    if (chartData.length > 0) {
      // Wait for charts to render before capturing
      const timer = setTimeout(() => {
        console.log("Charts should be rendered now, attempting capture...");
        captureCharts();
      }, 3000); // Increased timeout to ensure charts are fully rendered
      
      return () => clearTimeout(timer);
    }
  }, [chartData]);

  // Add a function to manually trigger chart capture
  const handleManualCaptureCharts = async () => {
    setStatusMessage('Manually capturing charts...');
    try {
      const capturedImages = await captureCharts();
      if (capturedImages && capturedImages.length > 0) {
        setStatusMessage(`Successfully captured ${capturedImages.length} charts. Ready to generate PDF.`);
      } else {
        setStatusMessage('No charts were captured. Please try again or check if charts are rendered.');
      }
    } catch (error) {
      console.error('Error in manual chart capture:', error);
      setStatusMessage(`Error in manual chart capture: ${error.message}`);
    }
  };

  // Handle PDF generation using a more reliable method
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    
    try {
      // If there's chart data but no chart images, try to capture charts first
      if (chartData.length > 0 && (!chartImages || chartImages.length === 0)) {
        setStatusMessage('Capturing charts before generating PDF...');
        await captureCharts();
      }
      
      // Create the PDF document using our container component
      const pdfDoc = <ReportPDAPDFContainer data={formData} />;
      const asPdf = pdf();
      asPdf.updateContainer(pdfDoc);
      const blob = await asPdf.toBlob();
      
      // Create a URL and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PDA_Report_${formData.title.replace(/\s+/g, "_") || "report"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError(error.message || "Failed to generate PDF");
      setIsGeneratingPDF(false);
    }
  };

  // Generate Word document
  const generateWordReport = async () => {
    setIsGeneratingWord(true);
    setWordError(null);
    
    try {
      const sections = [];
      
      // Header section
      const commonSection = {
        properties: {},
        children: [
          new Paragraph({ text: "PUNE INSTITUTE OF COMPUTER TECHNOLOGY", heading: "Title" }),
          new Paragraph({ text: "Department: Information Technology", bold: true }),
          new Paragraph(new TextRun({ text: `Date: ${formData.date || 'N/A'}`, bold: true })),
          new Paragraph({ text: formData.title || 'N/A', heading: "Heading1" }),
          new Paragraph(`Target Audience: ${formData.targetAudience || 'N/A'}`),
          new Paragraph(`Organized By: ${formData.organizedBy || 'N/A'}`),
          new Paragraph(`Venue: ${formData.venue || 'N/A'}`),
          new Paragraph(`Time: ${formData.time || 'N/A'}`),
          new Paragraph(`Number of Participants: ${formData.participants || 'N/A'}`),
          new Paragraph(""),
          new Paragraph({ text: "Faculty Members:", heading: "Heading2" })
        ]
      };
      
      // Add faculty members
      if (formData.faculty && formData.faculty.length > 0) {
        formData.faculty.forEach((faculty, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${faculty.name} (${faculty.role})`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Student Members:", heading: "Heading2" })
      );
      
      // Add student members
      if (formData.students && formData.students.length > 0) {
        formData.students.forEach((student, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${student}`));
        });
      }
      
      // Add other PDA-specific sections
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Objectives:", heading: "Heading2" })
      );
      
      if (formData.objectives && formData.objectives.length > 0) {
        formData.objectives.forEach((obj, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${obj}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Execution:", heading: "Heading2" }),
        new Paragraph(formData.execution || 'N/A'),
        new Paragraph(""),
        new Paragraph({ text: "Outcomes:", heading: "Heading2" })
      );
      
      if (formData.outcomes && formData.outcomes.length > 0) {
        formData.outcomes.forEach((outcome, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${outcome}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Impact Analysis:", heading: "Heading2" })
      );
      
      if (formData.impactAnalysis && formData.impactAnalysis.length > 0) {
        formData.impactAnalysis.forEach((impact, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${impact}`));
        });
      }
      
      commonSection.children.push(
        new Paragraph(""),
        new Paragraph({ text: "Feedback Analysis:", heading: "Heading2" })
      );
      
      if (formData.feedback && formData.feedback.length > 0) {
        formData.feedback.forEach((fb, index) => {
          commonSection.children.push(new Paragraph(`${index + 1}. ${fb}`));
        });
      }
      
      sections.push(commonSection);
      
      const doc = new Document({
        sections: sections,
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `PDA_Report_${formData.title.replace(/\s+/g, "_")}.docx`);
      
      setIsGeneratingWord(false);
      return true;
    } catch (error) {
      console.error("Error generating Word document:", error);
      setWordError(error.message || "Failed to generate Word document");
      setIsGeneratingWord(false);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      // Check if we have chart data but no captured chart images
      if (chartData.length > 0 && (!chartImages || chartImages.length === 0)) {
        console.log("Charts not captured yet, attempting to capture before saving");
        setStatusMessage("Capturing charts before saving report...");
        await captureCharts();
      }
      
      // Create a copy of formData with reportType added
      const reportDataToSave = {
        ...formData,
        chartImages: chartImages, // Ensure latest chart images are included
        reportType: 'pda' // Mark this as a PDA report
      };
      
      // Make the API call to save the report
      const response = await axios.post("http://localhost:8000/api/reports", reportDataToSave, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("PDA Report Created:", response.data);
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // The PDF will be generated through the BlobProvider in the UI
    } catch (error) {
      console.error("Error creating PDA report:", error.response?.data || error.message);
      alert("Failed to save PDA report. Please try again.");
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
      // Clean up any object URLs
      imageFiles.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
      
      setImageFiles([]);
      setExcelFile(null);
      setFormData(initialFormState);
    }
  };

  // Handle array field updates (update for faculty to handle name and role)
  const handleArrayItemChange = (field, index, value, subfield = null) => {
    if (field === 'faculty' && subfield) {
      const newArray = [...formData[field]];
      newArray[index] = { ...newArray[index], [subfield]: value };
      setFormData({ ...formData, [field]: newArray });
    } else {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData({ ...formData, [field]: newArray });
    }
  };

  // Add new item to array field (updated for faculty)
  const handleAddArrayItem = (field) => {
    if (field === 'faculty') {
      const newArray = [...formData[field], { name: "", role: "" }];
      setFormData({ ...formData, [field]: newArray });
    } else {
      const newArray = [...formData[field], ""];
      setFormData({ ...formData, [field]: newArray });
    }
  };

  // Remove item from array field
  const handleRemoveArrayItem = (field, index) => {
    if (formData[field].length <= 1) return;
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-102">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create PDA Report</h2>
        
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">
            PDA Report saved successfully!
          </div>
        )}

        {/* Status Messages */}
        {statusMessage && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 border border-blue-200 rounded flex items-center">
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Basic Event Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Event Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-bold text-gray-800 mb-2">Report Title:</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="A Knowledge Assessment Quiz-Internship and Placement Preparation"
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-800 mb-2">Target Audience:</label>
              <input
                type="text"
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Third Year and Second Year Students of IT Department"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-bold text-gray-800 mb-2">Date:</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-800 mb-2">Time:</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="11:00 am to 12:00 pm"
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-800 mb-2">Venue:</label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Google form"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-2">Institution:</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Pune Institute of Computer Technology"
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-800 mb-2">Organized By (Committee Name):</label>
              <input
                type="text"
                required
                value={formData.organizedBy}
                onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Professional Development Activity Committee"
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-800 mb-2">Number of Participants:</label>
              <input
                type="text"
                required
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="230"
              />
            </div>
          </div>
        </div>

        {/* Faculty Members */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Faculty Members (Organizers)</h3>
          <p className="text-gray-600 mb-3">
            Enter the faculty members and their respective roles who organized this event.
          </p>
          
          {formData.faculty.map((faculty, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name:</label>
                <input
                  type="text"
                  value={faculty.name}
                  onChange={(e) => handleArrayItemChange('faculty', index, e.target.value, 'name')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={index === 0 ? "Mr. Sachin Pande" : 
                             index === 1 ? "Mrs. Amruta Patil" : 
                             index === 2 ? "Mr. Vinit Tribhuvan" : "Faculty Name"}
                />
              </div>
              
              <div className="flex items-center">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                  <input
                    type="text"
                    value={faculty.role}
                    onChange={(e) => handleArrayItemChange('faculty', index, e.target.value, 'role')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={index === 0 ? "Head – Professional Development Committee" : 
                               index === 1 ? "Member of PDA" : 
                               index === 2 ? "Member of PDA" : "Faculty Role"}
                  />
                </div>
                
                {formData.faculty.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('faculty', index)}
                    className="ml-3 p-2 text-red-500 hover:text-red-700 self-end"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('faculty')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Faculty Member
          </button>
        </div>

        {/* Student Members */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Student Members</h3>
          
          {formData.students.map((student, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={student}
                onChange={(e) => handleArrayItemChange('students', index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={index === 0 ? "Rudraksh Khandelwal" : 
                            index === 1 ? "Mikhiel Benji" : 
                            index === 2 ? "Akshay Raut" : 
                            index === 3 ? "Om Patil" : `Student Member ${index + 1}`}
              />
              {formData.students.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('students', index)}
                  className="ml-2 p-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('students')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Student Member
          </button>
        </div>

        {/* Objectives */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Objectives</h3>
          
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleArrayItemChange('objectives', index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={index === 0 ? "Foster a competitive yet supportive environment to encourage skill showcasing and mutual learning." : 
                            index === 1 ? "Assess participants' skills dynamically and challenge them in a lively quiz setting." : 
                            index === 2 ? "Facilitate in-depth domain knowledge acquisition essential for success in future internships and placements." : 
                            `Objective ${index + 1}`}
              />
              {formData.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('objectives', index)}
                  className="ml-2 p-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('objectives')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Objective
          </button>
        </div>

        {/* Execution */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Execution</h3>
          
          <textarea
            value={formData.execution}
            onChange={(e) => setFormData({ ...formData, execution: e.target.value })}
            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder="A knowledge assessment quiz to help students in placement and internship selection process, was held on the specified date from 9:00pm. The quiz focused on data structures and algorithms."
          />
        </div>

        {/* Outcomes */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Outcomes</h3>
          
          {formData.outcomes.map((outcome, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => handleArrayItemChange('outcomes', index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={index === 0 ? "Participants will demonstrate improved proficiency in the assessed skills, indicating growth and development in their knowledge areas." : 
                            index === 1 ? "Attendees will acquire a deeper understanding of the domain, enhancing their expertise and readiness for future internship and placement opportunities." : 
                            index === 2 ? "The top scorers will be honored with a special gift, fostering a sense of achievement and motivation among participants." : 
                            `Outcome ${index + 1}`}
              />
              {formData.outcomes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('outcomes', index)}
                  className="ml-2 p-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('outcomes')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Outcome
          </button>
        </div>

        {/* Impact Analysis */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Impact Analysis</h3>
          
          {formData.impactAnalysis.map((impact, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={impact}
                onChange={(e) => handleArrayItemChange('impactAnalysis', index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={index === 0 ? "Enhanced problem solving and critical thinking" : 
                            index === 1 ? "Preparation for future tests for internships and placements" : 
                            index === 2 ? "Increased awareness of knowledge gaps" : 
                            index === 3 ? "Overall readiness for internships and placements" : 
                            `Impact ${index + 1}`}
              />
              {formData.impactAnalysis.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('impactAnalysis', index)}
                  className="ml-2 p-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('impactAnalysis')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Impact
          </button>
        </div>

        {/* Feedback Excel Upload Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Feedback Data Analysis</h3>
          <p className="text-gray-600 mb-3">
            Upload an Excel file containing feedback data. The file should have column headers with questions containing "?" character. Each row should represent one student's responses.
          </p>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={feedbackInputRef}
            onChange={handleFeedbackUpload}
            className="hidden"
            accept=".xlsx,.xls"
          />
          
          {/* Custom upload button */}
          <button
            type="button"
            onClick={() => feedbackInputRef.current.click()}
            className="mb-4 flex items-center p-3 border-2 border-dashed border-green-300 rounded-md text-green-500 hover:text-green-700 hover:border-green-500"
            disabled={isProcessingFeedback}
          >
            {isProcessingFeedback ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Feedback Data...
              </>
            ) : (
              <>
                <FaFileExcel className="mr-2" /> Upload Feedback Excel
              </>
            )}
          </button>
          
          {excelFile && (
            <div className="mt-2 p-3 bg-green-50 text-green-700 border border-green-200 rounded flex items-center">
              <FaFileExcel className="mr-2" /> 
              <span className="font-medium">{excelFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setExcelFile(null);
                  setChartData([]);
                  setFormData(prev => ({...prev, feedbackData: [], chartImages: []}));
                }}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Feedback Charts Display */}
        {chartData.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Feedback Charts</h3>
              <button
                type="button"
                onClick={handleManualCaptureCharts}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Capture Charts Manually
              </button>
            </div>
            
            <div ref={chartsContainerRef} id="chart-container" className="p-4 border border-gray-300 rounded-md">
              <FeedbackCharts chartsData={chartData} />
            </div>
          </div>
        )}

        {/* Descriptive Feedback */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Descriptive Feedback</h3>
          
          {formData.feedback.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayItemChange('feedback', index, e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={index === 0 ? "This test was really helpful for our Placement preparation" : 
                            index === 1 ? "Very good quality questions!" : 
                            index === 2 ? "Great experience" : 
                            index === 3 ? "Keep taking similar quizes" : 
                            index === 4 ? "Quiz level was medium and excellent quality of questions." : 
                            index === 5 ? "Quiz is good but its too lengthy" : 
                            index === 6 ? "Best quiz ever!!" : 
                            `Feedback ${index + 1}`}
              />
              {formData.feedback.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('feedback', index)}
                  className="ml-2 p-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => handleAddArrayItem('feedback')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center mt-2"
          >
            <FaPlus className="mr-1" /> Add Feedback
          </button>
        </div>

        {/* Submit Button */}
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
          <div className="flex space-x-3">
            <ErrorBoundary
              fallback={
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
                  onClick={() => {
                    setPdfError(null);
                    handleGeneratePDF();
                  }}
                >
                  Try PDF generation again
                </button>
              }
            >
              <button
                type="button"
                disabled={isGeneratingPDF}
                onClick={handleGeneratePDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
              >
                {isGeneratingPDF ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing PDF...
                  </span>
                ) : (
                  <><FaFilePdf className="mr-2" /> Download PDF</>
                )}
              </button>
            </ErrorBoundary>
            
            <ErrorBoundary
              fallback={
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
                  onClick={() => {
                    setWordError(null);
                    generateWordReport();
                  }}
                >
                  Try Word generation again
                </button>
              }
            >
              <button
                type="button"
                disabled={isGeneratingWord}
                onClick={generateWordReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
              >
                {isGeneratingWord ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing Word...
                  </span>
                ) : (
                  <><FaFileWord className="mr-2" /> Download Word</>
                )}
              </button>
            </ErrorBoundary>
            
            {pdfError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-sm mt-2">
                Error: {pdfError}
              </div>
            )}
            {wordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-sm mt-2">
                Error: {wordError}
              </div>
            )}
            <button 
              type="submit" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Save PDA Report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportPDA; 