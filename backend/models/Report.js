const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatmentPlan: [{
    procedure: String,
    description: String,
    estimatedCost: Number,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    }
  }],
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  aiFindings: mongoose.Schema.Types.Mixed,
  costEstimate: {
    total: Number,
    breakdown: [{
      item: String,
      cost: Number
    }]
  },
  fileUrl: String,
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'finalized'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
