const mongoose = require('mongoose');

const OrphanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  adopted: {
    type: Boolean,
    default: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Optional: hospital or orphanage context (auto-detected from addedBy)
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  orphanage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orphanage',
  },
}, { timestamps: true });

module.exports = mongoose.model('Orphan', OrphanSchema);
