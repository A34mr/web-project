const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate report (doctor/clinic admin)
router.post('/', authMiddleware, roleCheck('doctor', 'clinic_admin'), async (req, res) => {
  try {
    const {
      appointmentId,
      diagnosis,
      treatmentPlan,
      prescriptions,
      costEstimate,
      notes,
      aiFindings
    } = req.body;

    if (!appointmentId || !diagnosis) {
      return res.status(400).json({ 
        success: false, 
        message: 'Appointment ID and diagnosis are required' 
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('clinic');

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Find doctor profile
    const doctor = await DoctorProfile.findOne({ user: req.userId });

    const report = new Report({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: doctor ? doctor._id : null,
      clinic: appointment.clinic._id,
      diagnosis,
      treatmentPlan: treatmentPlan || [],
      prescriptions: prescriptions || [],
      costEstimate: costEstimate || { total: 0, breakdown: [] },
      aiFindings: aiFindings || null,
      notes,
      status: 'draft'
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report
    });
  } catch (error) {
    console.error('Create report error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create report'
    });
  }
});

// Finalize report
router.put('/:id/finalize', authMiddleware, roleCheck('doctor', 'clinic_admin'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: 'Report not found' 
      });
    }

    report.status = 'finalized';
    await report.save();

    res.json({
      success: true,
      message: 'Report finalized',
      report
    });
  } catch (error) {
    console.error('Finalize report error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to finalize report'
    });
  }
});

// Generate PDF report
router.get('/:id/pdf', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'firstName lastName specialty' }
      })
      .populate('clinic')
      .populate('appointment');

    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: 'Report not found' 
      });
    }

    // Check permissions
    const isPatient = report.patient._id.toString() === req.userId;
    const isDoctorOrAdmin = req.user.role === 'doctor' || req.user.role === 'clinic_admin' || req.user.role === 'admin';

    if (!isPatient && !isDoctorOrAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filename = `report-${report._id}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF Content
    doc.fontSize(20).text('Dent AI - Dental Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Report Date: ${new Date(report.createdAt).toLocaleDateString()}`);
    doc.text(`Clinic: ${report.clinic.name}`);
    doc.text(`Doctor: ${report.doctor?.user?.firstName} ${report.doctor?.user?.lastName}`);
    doc.text(`Patient: ${report.patient.firstName} ${report.patient.lastName}`);
    doc.moveDown();

    doc.fontSize(16).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(report.diagnosis);
    doc.moveDown();

    if (report.treatmentPlan && report.treatmentPlan.length > 0) {
      doc.fontSize(16).text('Treatment Plan:', { underline: true });
      report.treatmentPlan.forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. ${item.procedure}: ${item.description}`);
        if (item.estimatedCost) doc.text(`   Cost: $${item.estimatedCost}`);
      });
      doc.moveDown();
    }

    if (report.prescriptions && report.prescriptions.length > 0) {
      doc.fontSize(16).text('Prescriptions:', { underline: true });
      report.prescriptions.forEach((rx, index) => {
        doc.fontSize(12).text(`${index + 1}. ${rx.medication} - ${rx.dosage}`);
        doc.text(`   Frequency: ${rx.frequency}, Duration: ${rx.duration}`);
        if (rx.instructions) doc.text(`   Instructions: ${rx.instructions}`);
      });
      doc.moveDown();
    }

    if (report.costEstimate && report.costEstimate.total) {
      doc.fontSize(16).text('Cost Estimate:', { underline: true });
      doc.fontSize(12).text(`Total: $${report.costEstimate.total}`);
      doc.moveDown();
    }

    if (report.aiFindings && report.aiFindings.cavitiesDetected) {
      doc.fontSize(16).text('AI Analysis Findings:', { underline: true });
      report.aiFindings.cavitiesDetected.forEach((cavity, index) => {
        doc.fontSize(12).text(`${index + 1}. Location: ${cavity.location}`);
        doc.text(`   Confidence: ${(cavity.confidence * 100).toFixed(1)}%`);
        doc.text(`   Severity: ${cavity.severity}`);
      });
      doc.moveDown();
    }

    if (report.notes) {
      doc.fontSize(16).text('Additional Notes:', { underline: true });
      doc.fontSize(12).text(report.notes);
    }

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, filename, (err) => {
        if (err) console.error('Download error:', err);
      });
    });
  } catch (error) {
    console.error('Generate PDF error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF'
    });
  }
});

// Get patient's reports
router.get('/my-reports', authMiddleware, roleCheck('patient'), async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.userId })
      .populate('doctor', 'specialty')
      .populate('clinic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Get reports error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reports'
    });
  }
});

module.exports = router;
