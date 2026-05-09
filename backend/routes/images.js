const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const Appointment = require('../models/Appointment');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const upload = require('../middleware/upload');
const aiService = require('../services/aiService');
const path = require('path');

// Upload dental image and get AI analysis
router.post('/upload', authMiddleware, roleCheck('patient'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const { appointmentId, imageType, description } = req.body;

    // Validate appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.patient.toString() !== req.userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid appointment' 
        });
      }
    }

    // Run AI analysis on uploaded image
    const imagePath = path.join(__dirname, '..', req.file.path);
    const aiAnalysis = await aiService.analyzeImage(imagePath);

    // Save image record
    const image = new Image({
      patient: req.userId,
      appointment: appointmentId || null,
      imageUrl: `/uploads/${req.file.filename}`,
      imageType: imageType || 'Other',
      description,
      aiAnalysis
    });

    await image.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded and analyzed successfully',
      image
    });
  } catch (error) {
    console.error('Upload image error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload and analyze image'
    });
  }
});

// Get patient's images
router.get('/my-images', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const images = await Image.find({ patient: req.userId })
      .populate('appointment', 'dateTime reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Get images error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch images'
    });
  }
});

// Get images for specific appointment
router.get('/appointment/:appointmentId', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Check permissions
    const isPatient = appointment.patient.toString() === req.userId;
    const isDoctorOrAdmin = req.user.role === 'doctor' || req.user.role === 'clinic_admin' || req.user.role === 'admin';

    if (!isPatient && !isDoctorOrAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const images = await Image.find({ appointment: req.params.appointmentId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Get appointment images error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch images'
    });
  }
});

// Add dentist review to image
router.put('/:id/review', authMiddleware, roleCheck('doctor', 'clinic_admin'), async (req, res) => {
  try {
    const { diagnosis, notes } = req.body;
    
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }

    // Find doctor profile
    const DoctorProfile = require('../models/DoctorProfile');
    const doctor = await DoctorProfile.findOne({ user: req.userId });
    
    image.dentistReview = {
      reviewedBy: doctor ? doctor._id : null,
      diagnosis,
      notes,
      reviewedAt: new Date()
    };

    await image.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      image
    });
  } catch (error) {
    console.error('Add review error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add review'
    });
  }
});

// Get single image details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('patient', 'firstName lastName email')
      .populate('appointment', 'dateTime reason');

    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }

    // Check permissions
    const isPatient = image.patient._id.toString() === req.userId;
    const isDoctorOrAdmin = req.user.role === 'doctor' || req.user.role === 'clinic_admin' || req.user.role === 'admin';

    if (!isPatient && !isDoctorOrAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      image
    });
  } catch (error) {
    console.error('Get image error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch image'
    });
  }
});

module.exports = router;
