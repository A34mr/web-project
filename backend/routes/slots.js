const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Clinic = require('../models/Clinic');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Get available slots for a clinic/doctor
router.get('/', async (req, res) => {
  try {
    const { clinicId, doctorId, date } = req.query;
    let query = { isBooked: false };
    
    if (clinicId) query.clinic = clinicId;
    if (doctorId) query.doctor = doctorId;
    if (date) {
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);
      query.dateTime = { $gte: start, $lte: end };
    } else {
      query.dateTime = { $gte: new Date() }; // Future slots only
    }

    const slots = await Slot.find(query).sort({ dateTime: 1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching slots' });
  }
});

// Create slots (Clinic Admin or Doctor)
router.post('/', authMiddleware, roleCheck('clinic_admin', 'doctor', 'admin'), async (req, res) => {
  try {
    const { clinicId, doctorId, dateTime, serviceType, duration, capacity } = req.body;
    
    // Authorization check omitted for brevity, should verify clinic/doctor ownership
    
    const slot = new Slot({
      clinic: clinicId,
      doctor: doctorId,
      dateTime,
      serviceType,
      duration,
      capacity
    });

    await slot.save();
    res.status(201).json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
