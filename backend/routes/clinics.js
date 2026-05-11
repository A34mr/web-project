const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Get clinic managed by current user
router.get('/my-clinic', authMiddleware, roleCheck('clinic_admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findOne({ admin: req.userId })
      .populate('admin', 'firstName lastName email')
      .populate({
        path: 'doctors',
        populate: {
          path: 'user',
          select: 'firstName lastName email phone avatar'
        }
      });
      
    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'No clinic found for this user' 
      });
    }

    res.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error('Get my clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your clinic'
    });
  }
});

// Get all clinics with filters
router.get('/', async (req, res) => {
  try {
    const { city, specialty, priceRange, minRating, search } = req.query;
    
    let query = { isActive: true };
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    if (specialty) {
      query.specialties = { $in: [new RegExp(specialty, 'i')] };
    }
    
    if (priceRange) {
      query.priceRange = priceRange;
    }
    
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const clinics = await Clinic.find(query)
      .populate('admin', 'firstName lastName email')
      .sort({ 'rating.average': -1 })
      .limit(50);

    res.json({
      success: true,
      count: clinics.length,
      clinics
    });
  } catch (error) {
    console.error('Get clinics error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch clinics'
    });
  }
});

// Get nearest clinics using geolocation
router.get('/nearest', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const clinics = await Clinic.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance),
          spherical: true,
          query: { isActive: true, isVerified: true }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'admin',
          foreignField: '_id',
          as: 'admin'
        }
      },
      {
        $unwind: {
          path: '$admin',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          admin: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1
          },
          name: 1,
          address: 1,
          location: 1,
          specialties: 1,
          priceRange: 1,
          rating: 1,
          phone: 1,
          description: 1,
          distance: 1
        }
      },
      {
        $limit: 20
      }
    ]);

    res.json({
      success: true,
      count: clinics.length,
      clinics
    });
  } catch (error) {
    console.error('Get nearest clinics error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch nearest clinics'
    });
  }
});

// Add a new doctor to the clinic
router.post('/:id/doctors', authMiddleware, roleCheck('clinic_admin', 'admin'), async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialty, licenseNumber } = req.body;
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' });
    
    // Check permissions
    if (req.user.role !== 'admin' && clinic.admin.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Create doctor user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'doctor',
      phone: 'Not provided'
    });
    await user.save();

    // Create doctor profile
    const doctorProfile = await DoctorProfile.create({
      user: user._id,
      clinic: clinic._id,
      specialty: specialty || 'General Dentist',
      licenseNumber: licenseNumber || 'PENDING',
      isVerified: true
    });

    // Add to clinic's doctors list
    clinic.doctors.push(doctorProfile._id);
    await clinic.save();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      doctor: doctorProfile
    });
  } catch (error) {
    console.error('Add doctor error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add doctor' });
  }
});

// Get single clinic by ID
router.get('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id)
      .populate('admin', 'firstName lastName email')
      .populate({
        path: 'doctors',
        model: 'DoctorProfile',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        }
      });

    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Clinic not found' 
      });
    }

    res.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error('Get clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch clinic'
    });
  }
});

// Register new clinic (for clinic admins)
router.post('/', authMiddleware, roleCheck('clinic_admin', 'admin'), async (req, res) => {
  try {
    const {
      name,
      address,
      location,
      phone,
      email,
      licenseNumber,
      specialties,
      description,
      workingHours,
      priceRange
    } = req.body;

    // Validate required fields
    if (!name || !address || !phone || !email || !licenseNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields are missing' 
      });
    }

    // Check if clinic with same license exists
    const existingClinic = await Clinic.findOne({ licenseNumber });
    if (existingClinic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Clinic with this license already exists' 
      });
    }

    const clinic = new Clinic({
      name,
      address,
      location,
      phone,
      email,
      licenseNumber,
      specialties,
      description,
      workingHours,
      priceRange,
      admin: req.userId,
      isVerified: false // Requires admin approval
    });

    await clinic.save();

    // Update user's role if needed
    if (req.user.role === 'clinic_admin') {
      await User.findByIdAndUpdate(req.userId, { role: 'clinic_admin' });
    }

    res.status(201).json({
      success: true,
      message: 'Clinic registered successfully. Awaiting admin approval.',
      clinic
    });
  } catch (error) {
    console.error('Register clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register clinic'
    });
  }
});

// Update clinic (clinic admin or system admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Clinic not found' 
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && clinic.admin.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const updates = req.body;
    
    // Prevent updating certain fields
    delete updates._id;
    delete updates.admin;
    delete updates.isVerified;

    Object.assign(clinic, updates);
    await clinic.save();

    res.json({
      success: true,
      message: 'Clinic updated successfully',
      clinic
    });
  } catch (error) {
    console.error('Update clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update clinic'
    });
  }
});

// Approve clinic (admin only)
router.put('/:id/approve', authMiddleware, roleCheck('admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Clinic not found' 
      });
    }

    clinic.isVerified = true;
    await clinic.save();

    res.json({
      success: true,
      message: 'Clinic approved successfully',
      clinic
    });
  } catch (error) {
    console.error('Approve clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve clinic'
    });
  }
});

// Delete clinic (admin only)
router.delete('/:id', authMiddleware, roleCheck('admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Clinic not found' 
      });
    }

    clinic.isActive = false;
    await clinic.save();

    res.json({
      success: true,
      message: 'Clinic deactivated successfully'
    });
  } catch (error) {
    console.error('Delete clinic error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete clinic'
    });
  }
});

module.exports = router;
