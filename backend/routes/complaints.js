const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Clinic = require('../models/Clinic');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Submit complaint (patient)
router.post('/', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const { clinicId, description, category } = req.body;

    if (!clinicId || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Clinic ID and description are required' 
      });
    }

    // Verify clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Clinic not found' 
      });
    }

    const complaint = new Complaint({
      patient: req.userId,
      clinic: clinicId,
      description,
      category: category || 'Other'
    });

    await complaint.save();

    // Add to patient's profile
    const PatientProfile = require('../models/PatientProfile');
    await PatientProfile.findOneAndUpdate(
      { user: req.userId },
      { $push: { complaints: complaint._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Submit complaint error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit complaint'
    });
  }
});

// Get patient's complaints
router.get('/my-complaints', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ patient: req.userId })
      .populate('clinic', 'name address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch complaints'
    });
  }
});

// Get clinic's complaints (clinic admin or system admin)
router.get('/clinic/:clinicId', authMiddleware, async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.clinicId);
    
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

    const complaints = await Complaint.find({ clinic: req.params.clinicId })
      .populate('patient', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('Get clinic complaints error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch complaints'
    });
  }
});

// Update complaint status (admin only)
router.put('/:id', authMiddleware, roleCheck('admin'), async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Complaint not found' 
      });
    }

    if (status) complaint.status = status;
    if (adminResponse) {
      complaint.adminResponse = adminResponse;
      if (status === 'resolved' || status === 'rejected') {
        complaint.resolvedAt = new Date();
      }
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update complaint error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update complaint'
    });
  }
});

module.exports = router;
