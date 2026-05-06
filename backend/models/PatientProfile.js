const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  allergies: [String],
  currentMedications: [String],
  complaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }]
}, { timestamps: true });

patientProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
