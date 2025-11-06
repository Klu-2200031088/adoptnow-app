const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
    unique: true  // 1 child = 1 active request
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Adoption', adoptionSchema);
