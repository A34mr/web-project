const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
  specialty: {
    type: String,
    required: true,
    enum: ['General Dentist', 'Orthodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Periodontist', 'Endodontist', 'Prosthodontist']
  },
  licenseNumber: {
    type: String,
    required: true
  },
  yearsOfExperience: Number,
  education: String,
  bio: String,
  workingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    isWorking: {
      type: Boolean,
      default: true
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
