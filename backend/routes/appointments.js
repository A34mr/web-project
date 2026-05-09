const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Book appointment (patient)
router.post('/', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const { doctorId, clinicId, dateTime, reason, notes, duration } = req.body;

    if (!doctorId || !clinicId || !dateTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Check if doctor exists and belongs to clinic
    const doctor = await DoctorProfile.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      dateTime: new Date(dateTime),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = new Appointment({
      patient: req.userId,
      doctor: doctorId,
      clinic: clinicId,
      dateTime: new Date(dateTime),
      reason,
      notes,
      duration: duration || 30,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'firstName lastName email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('clinic', 'name address phone');

    // Simulate email reminder
    console.log(`[EMAIL] Appointment confirmation sent to patient`);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully. Awaiting payment.',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Book appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
});

// Get patient's appointments
router.get('/my-appointments', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    let query = { patient: req.userId };

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.dateTime = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName specialty' }
      })
      .populate('clinic', 'name address phone')
      .sort({ dateTime: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// Get clinic's appointments
router.get('/clinic/:clinicId', authMiddleware, async (req, res) => {
  try {
    const clinicId = req.params.clinicId;
    const { status, date } = req.query;

    // ── FIX #7: Verify the user is affiliated with this clinic ──
    // Patients: must have an appointment at this clinic
    // Doctors/Clinic Admins: must work at this clinic
    // Admins: can view any clinic
    const userRole = req.user.role;
    const userId = req.userId;

    if (userRole !== 'admin') {
      // Check if user is clinic admin
      const clinic = await Clinic.findById(clinicId);
      if (!clinic) {
        return res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
      }

      const isAdmin = clinic.admin && clinic.admin.toString() === userId;
      const isDoctor = userRole === 'doctor' || userRole === 'clinic_admin';

      if (!isAdmin && !isDoctor) {
        // For patients: check if they have appointments at this clinic
        const hasAppointment = await Appointment.exists({
          clinic: clinicId,
          patient: userId
        });
        if (!hasAppointment) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You are not affiliated with this clinic.'
          });
        }
      }
    }

    let query = { clinic: clinicId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.dateTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get clinic appointments error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// Confirm appointment (after payment)
router.put('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Only patient or clinic admin can confirm
    if (req.user.role !== 'patient' && req.user.role !== 'clinic_admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (appointment.patient.toString() !== req.userId && req.user.role !== 'clinic_admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment confirmed',
      appointment
    });
  } catch (error) {
    console.error('Confirm appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm appointment'
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Only patient or admin can cancel
    if (appointment.patient.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
});

// ── FIX #6: Complete appointment - restricted to doctors/clinic_admins/admins ──
router.put('/:id/complete', authMiddleware, roleCheck('doctor', 'clinic_admin', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify the doctor/clinic_admin is associated with this appointment's clinic
    if (req.user.role !== 'admin') {
      const clinic = await Clinic.findById(appointment.clinic);
      const isClinicAdmin = clinic && clinic.admin && clinic.admin.toString() === req.userId;

      if (!isClinicAdmin && req.user.role !== 'admin') {
        // Check if doctor is assigned to this appointment
        if (appointment.doctor && appointment.doctor.toString() !== req.userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only complete your own appointments.'
          });
        }
      }
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment completed',
      appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment'
    });
  }
});

// Process payment (mock)
router.put('/:id/payment', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.patient.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    appointment.paymentStatus = 'paid';
    appointment.paymentMethod = paymentMethod || 'card';
    appointment.transactionId = transactionId || `TXN-${Date.now()}`;
    await appointment.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      appointment
    });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  }
});

module.exports = router;
