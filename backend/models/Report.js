const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: String,
  subjectName: String,
  facultyName: String,
  date: String,
  studentsAttended: Number,
  objectives: [String],
  description: String,
  learningOutcomes: String,
  targetYear: String,
  images: [String],
  feedback: Array,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportType: { type: String, default: 'teaching' },
  participationData: Object,
  targetAudience: String,
  time: String,
  organizedBy: String,
  committeeType: String,
  institution: String,
  venue: String,
  fee: String,
  participants: String,
  faculty: [{ 
    name: String,
    role: String
  }],
  students: [String],
  execution: String,
  outcomes: [String],
  impactAnalysis: [String],
  chartImages: Array,
  excelData: Array
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Report', reportSchema);
