const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dateOfBirth: Date,
  location: { type: String, required: true },
  healthStatus: { type: String, default: 'Healthy' },
  backgroundStory: String,
  photos: [String], // image URLs
  specialNeeds: String,
  isAvailable: { type: Boolean, default: true },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to hospital/orphanage admin
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Child', childSchema);
