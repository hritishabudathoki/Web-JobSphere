const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicantName: String,
  email: String,
  resumeLink: String
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
