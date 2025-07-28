const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  salary: Number
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
