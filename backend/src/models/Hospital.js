const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  // Add more fields if needed
});

module.exports = mongoose.model('Hospital', hospitalSchema);
