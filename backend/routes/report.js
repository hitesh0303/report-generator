const express = require('express');
const Report = require('../models/Report');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/reports', authMiddleware, async (req, res) => {
  const report = new Report({ ...req.body, userId: req.userId });
  await report.save();
  res.status(201).json(report);
});

router.get('/reports/:id', authMiddleware, async (req, res) => {
  const report = await Report.findById(req.params.id);
  res.json(report);
});

module.exports = router;
