const mongoose = require('mongoose');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const DoctorProfile = require('../models/DoctorProfile');
const Slot = require('../models/Slot');
const Report = require('../models/Report');
const Image = require('../models/Image');

async function syncMockData() {
  try {
    console.log('Starting sync of requested mock data...');

    // 1. Clinics Data
    const clinicsData = [
      {
        _id: '69fbbb5a7d0ff03c85d53c2c',
        name: 'Smile Dental Center',
        address: { street: '123 Health Ave', city: 'Amman', state: 'Amman', zipCode: '11118', country: 'Jordan' },
        location: { type: 'Point', coordinates: [35.9285, 31.9454] },
        phone: '+962 6 123 4567',
        email: 'smile@example.com',
        licenseNumber: 'LC-2024-001',
        specialties: ['General Dentist', 'Orthodontist'],
        description: 'A friendly dental clinic providing modern care for all ages.',
        priceRange: '$$',
        rating: { average: 4.8, count: 120 },
        isVerified: true,
        isActive: true
      },
      {
        _id: '69fbbb5a7d0ff03c85d53c31',
        name: 'Elite Oral Health',
        address: { street: '456 Medical St', city: 'Cairo', state: 'Cairo', zipCode: '12345', country: 'Egypt' },
        location: { type: 'Point', coordinates: [31.2357, 30.0444] },
        phone: '+20 2 987 6543',
        email: 'elite@example.com',
        licenseNumber: 'LC-2024-002',
        specialties: ['General Dentist', 'Oral Surgeon'],
        description: 'Expert dental services with a focus on implants and aesthetics.',
        priceRange: '$$$',
        rating: { average: 4.9, count: 85 },
        isVerified: true,
        isActive: true
      },
      {
        _id: '69fbbb5a7d0ff03c85d53c33',
        name: 'Modern Tooth Care',
        address: { street: '789 Care Rd', city: 'Dubai', state: 'Dubai', zipCode: '00000', country: 'UAE' },
        location: { type: 'Point', coordinates: [55.2708, 25.2048] },
        phone: '+971 4 555 1234',
        email: 'modern@example.com',
        licenseNumber: 'LC-2024-003',
        specialties: ['Pediatric Dentist', 'General Dentist'],
        description: 'Providing gentle dental care using the latest technology.',
        priceRange: '$$',
        rating: { average: 4.7, count: 150 },
        isVerified: true,
        isActive: true
      }
    ];

    // 2. Doctor Data Mapping
    const doctorsData = [
      {
        userId: '69fbbb5a7d0ff03c85d53d01',
        profileId: '69fbbb5a7d0ff03c85d53e01',
        clinicId: '69fbbb5a7d0ff03c85d53c2c',
        firstName: 'Sarah',
        lastName: 'Ahmed',
        email: 'dr.sarah@smile.com',
        specialty: 'Orthodontist',
        license: 'DOC-001'
      },
      {
        userId: '69fbbb5a7d0ff03c85d53d02',
        profileId: '69fbbb5a7d0ff03c85d53e02',
        clinicId: '69fbbb5a7d0ff03c85d53c31',
        firstName: 'John',
        lastName: 'Doe',
        email: 'dr.john@elite.com',
        specialty: 'Oral Surgeon',
        license: 'DOC-002'
      },
      {
        userId: '69fbbb5a7d0ff03c85d53d03',
        profileId: '69fbbb5a7d0ff03c85d53e03',
        clinicId: '69fbbb5a7d0ff03c85d53c33',
        firstName: 'Mona',
        lastName: 'Zaki',
        email: 'dr.mona@modern.com',
        specialty: 'Pediatric Dentist',
        license: 'DOC-003'
      }
    ];

    // Upsert Clinics
    for (const clinicData of clinicsData) {
      await Clinic.findByIdAndUpdate(clinicData._id, clinicData, { upsert: true });
    }

    // Upsert Doctors
    for (const doc of doctorsData) {
      // 1. Create/Update User
      const user = await User.findById(doc.userId);
      if (!user) {
        await User.create({
          _id: doc.userId,
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          password: 'password123', // Will be hashed by pre-save hook
          role: 'doctor',
          phone: '123456789'
        });
      }

      // 2. Create/Update Profile
      const profileData = {
        _id: doc.profileId,
        user: doc.userId,
        clinic: doc.clinicId,
        specialty: doc.specialty,
        licenseNumber: doc.license,
        yearsOfExperience: 10,
        bio: `Expert ${doc.specialty} with years of experience in clinical care.`,
        isVerified: true
      };
      await DoctorProfile.findByIdAndUpdate(doc.profileId, profileData, { upsert: true });

      // 3. Link Profile to Clinic
      await Clinic.findByIdAndUpdate(doc.clinicId, {
        $addToSet: { doctors: doc.profileId }
      });

      // 4. Generate some mock slots for the next 7 days
      await generateSlots(doc.profileId, doc.clinicId);
    }

    // 5. Ensure the specific patient user exists so they can login and see the feature
    let testPatient = await User.findOne({ email: 'amrpaqt@gmail.com' });
    if (!testPatient) {
      testPatient = new User({
        firstName: 'Amr',
        lastName: 'hamdy pt',
        email: 'amrpaqt@gmail.com',
        role: 'patient',
        phone: '01153427931'
      });
    }
    // Always set the password to Password123! so the user can definitely login
    testPatient.password = 'Password123!';
    await testPatient.save();

    // Sync mock reports and images for any existing patients
    await syncPatientDocs();

    console.log('Successfully synced requested clinics, doctors, and slots.');
  } catch (error) {
    console.error('Mock data sync failed:', error.message);
  }
}

async function generateSlots(doctorId, clinicId) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const slots = [];
  // Create 5 slots for tomorrow
  for (let i = 0; i < 5; i++) {
    const slotTime = new Date(tomorrow);
    slotTime.setHours(9 + i, 0, 0, 0);
    
    slots.push({
      clinic: clinicId,
      doctor: doctorId,
      dateTime: slotTime,
      duration: 30,
      serviceType: 'Consultation',
      isBooked: false
    });
  }

  for (const slot of slots) {
    try {
      await Slot.findOneAndUpdate(
        { doctor: slot.doctor, dateTime: slot.dateTime },
        slot,
        { upsert: true }
      );
    } catch (e) {
      // Ignore duplicates
    }
  }
}

async function syncPatientDocs() {
  const patients = await User.find({ role: 'patient' });
  const clinic = await Clinic.findOne();
  const doctor = await DoctorProfile.findOne();

  for (const patient of patients) {
    // Add a mock report
    await Report.findOneAndUpdate(
      { patient: patient._id, diagnosis: 'Gingivitis' },
      {
        appointment: new mongoose.Types.ObjectId(), // Mock
        patient: patient._id,
        doctor: doctor._id,
        clinic: clinic._id,
        diagnosis: 'Gingivitis',
        treatmentPlan: [{ procedure: 'Deep Cleaning', description: 'Removal of plaque and tartar.', priority: 'medium' }],
        notes: 'Patient advised to floss daily.',
        status: 'finalized'
      },
      { upsert: true }
    );

    // Add a mock X-ray image
    await Image.findOneAndUpdate(
      { patient: patient._id, imageType: 'X-ray' },
      {
        patient: patient._id,
        imageUrl: '/uploads/mock-xray.jpg', // Mock path
        imageType: 'X-ray',
        description: 'Full mouth X-ray taken during last visit.'
      },
      { upsert: true }
    );
  }
}

module.exports = syncMockData;
