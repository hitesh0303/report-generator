const express = require('express');
const Report = require('../models/Report');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/reports', authMiddleware, async (req, res) => {
  try {
    // Check if we have incoming chart images data
    const hasChartImages = req.body.chartImages && req.body.chartImages.length > 0;
    console.log(`Saving report: ${req.body.title}, Chart images: ${hasChartImages ? req.body.chartImages.length : 0}`);
    
    // Create and save the report
    const report = new Report({ ...req.body, userId: req.userId });
    await report.save();
    
    console.log(`Report saved successfully with ID: ${report._id}`);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ 
      message: 'Error saving report', 
      error: error.message,
      details: error.stack
    });
  }
});

router.get('/reports', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

router.get('/reports/:id', authMiddleware, async (req, res) => {
  try {
    console.log(`Fetching report with ID: ${req.params.id}`);
    const report = await Report.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!report) {
      console.log(`Report not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Log chart image information
    const hasChartImages = report.chartImages && report.chartImages.length > 0;
    console.log(`Retrieved report: ${report.title}, Chart images: ${hasChartImages ? report.chartImages.length : 0}`);
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ 
      message: 'Error fetching report', 
      error: error.message,
      details: error.stack
    });
  }
});

module.exports = router;
