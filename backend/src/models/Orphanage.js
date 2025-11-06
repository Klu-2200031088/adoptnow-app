const mongoose = require('mongoose');

const orphanageSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  // Add more fields if needed
});

module.exports = mongoose.model('Orphanage', orphanageSchema);
