const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Service Quality', 'Staff Behavior', 'Facility', 'Billing', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminResponse: String,
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
