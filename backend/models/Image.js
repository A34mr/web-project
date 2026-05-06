const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageType: {
    type: String,
    enum: ['X-ray', 'OPG', 'Intraoral', 'Other'],
    default: 'Other'
  },
  aiAnalysis: {
    cavitiesDetected: [{
      location: String,
      confidence: Number,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      }
    }],
    overallConfidence: Number,
    suggestedSpecialist: String,
    rawResponse: mongoose.Schema.Types.Mixed,
    analyzedAt: Date
  },
  dentistReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorProfile'
    },
    diagnosis: String,
    notes: String,
    reviewedAt: Date
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
