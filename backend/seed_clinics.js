const mongoose = require('mongoose');
const Clinic = require('./models/Clinic');
require('dotenv').config();

const clinicsData = [
  {
    _id: '69fbbb5a7d0ff03c85d53c2c',
    name: 'Smile Dental Center',
    address: {
      street: '123 Health Ave',
      city: 'Amman',
      state: 'Amman',
      zipCode: '11118',
      country: 'Jordan'
    },
    location: {
      type: 'Point',
      coordinates: [35.9285, 31.9454] // [lng, lat]
    },
    phone: '+962 6 123 4567',
    email: 'smile@example.com',
    licenseNumber: 'LC-2024-001',
    specialties: ['General Dentistry', 'Orthodontics'],
    description: 'A friendly dental clinic providing modern care for all ages.',
    priceRange: '$$',
    rating: { average: 4.8, count: 120 },
    isVerified: true,
    isActive: true
  },
  {
    _id: '69fbbb5a7d0ff03c85d53c31',
    name: 'Elite Oral Health',
    address: {
      street: '456 Medical St',
      city: 'Cairo',
      state: 'Cairo',
      zipCode: '12345',
      country: 'Egypt'
    },
    location: {
      type: 'Point',
      coordinates: [31.2357, 30.0444]
    },
    phone: '+20 2 987 6543',
    email: 'elite@example.com',
    licenseNumber: 'LC-2024-002',
    specialties: ['Implantology', 'Cosmetic Dentistry'],
    description: 'Expert dental services with a focus on implants and aesthetics.',
    priceRange: '$$$',
    rating: { average: 4.9, count: 85 },
    isVerified: true,
    isActive: true
  },
  {
    _id: '69fbbb5a7d0ff03c85d53c33',
    name: 'Modern Tooth Care',
    address: {
      street: '789 Care Rd',
      city: 'Dubai',
      state: 'Dubai',
      zipCode: '00000',
      country: 'UAE'
    },
    location: {
      type: 'Point',
      coordinates: [55.2708, 25.2048]
    },
    phone: '+971 4 555 1234',
    email: 'modern@example.com',
    licenseNumber: 'LC-2024-003',
    specialties: ['Pediatric Dentistry', 'Periodontics'],
    description: 'Providing gentle dental care using the latest technology.',
    priceRange: '$$',
    rating: { average: 4.7, count: 150 },
    isVerified: true,
    isActive: true
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dentai';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    for (const data of clinicsData) {
      await Clinic.findByIdAndUpdate(
        data._id,
        data,
        { upsert: true, new: true }
      );
      console.log(`Clinic ${data.name} upserted.`);
    }

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
