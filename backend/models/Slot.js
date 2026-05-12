const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  serviceType: {
    type: String,
    enum: ['General Checkup', 'Dental Cleaning', 'Orthodontics', 'Surgery', 'Consultation'],
    default: 'General Checkup'
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Ensure unique slot per doctor at a specific time
slotSchema.index({ doctor: 1, dateTime: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
