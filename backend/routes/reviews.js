const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Submit review (patient after completed appointment)
router.post('/', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const { clinicId, appointmentId, rating, comment } = req.body;

    if (!clinicId || !rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Clinic ID, rating, and comment are required' 
      });
    }

    // Verify patient had a completed appointment at this clinic
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.patient.toString() !== req.userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid appointment' 
        });
      }
      
      if (appointment.status !== 'completed') {
        return res.status(400).json({ 
          success: false, 
          message: 'Can only review after completed appointment' 
        });
      }
    }

    // Check if user already reviewed this clinic
    const existingReview = await Review.findOne({
      clinic: clinicId,
      patient: req.userId
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this clinic' 
      });
    }

    const review = new Review({
      clinic: clinicId,
      patient: req.userId,
      appointment: appointmentId || null,
      rating,
      comment
    });

    await review.save();

    // Update clinic rating
    const stats = await Review.aggregate([
      { $match: { clinic: clinic._id ? clinic._id : require('mongoose').Types.ObjectId(clinicId), isApproved: true } },
      {
        $group: {
          _id: '$clinic',
          average: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    await Clinic.findByIdAndUpdate(clinicId, {
      'rating.average': stats[0]?.average || 0,
      'rating.count': stats[0]?.count || 0
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Submit review error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit review'
    });
  }
});

// Get reviews for a clinic
router.get('/clinic/:clinicId', async (req, res) => {
  try {
    const { limit = 20, sortBy = 'createdAt' } = req.query;

    const reviews = await Review.find({ 
      clinic: req.params.clinicId,
      isApproved: true 
    })
      .populate('patient', 'firstName lastName')
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews'
    });
  }
});

// Get user's own reviews
router.get('/my-reviews', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const reviews = await Review.find({ patient: req.userId })
      .populate('clinic', 'name address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get my reviews error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews'
    });
  }
});

module.exports = router;
