const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const { authMiddleware } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// ── FIX #3: Use short-lived access tokens + refresh tokens ──
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// In-memory token blacklist for logout/revocation
// NOTE: For production with multiple server instances, use Redis instead
const tokenBlacklist = new Set();

/**
 * Clean up expired entries from the blacklist periodically (every hour)
 * This prevents memory leaks from accumulating expired tokens
 */
setInterval(() => {
  tokenBlacklist.clear();
}, 60 * 60 * 1000);

// Check if token is blacklisted
const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient',
      phone
    });

    await user.save();

    // Create appropriate profile based on role
    if (user.role === 'patient') {
      const { dob, gender, chronic, allergies, dentalIssues } = req.body;
      const profileData = {
        user: user._id,
        dateOfBirth: dob ? new Date(dob) : undefined,
        gender: gender?.toLowerCase(),
        allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
        medicalHistory: []
      };
      if (chronic) profileData.medicalHistory.push({ condition: chronic, notes: 'Chronic Condition' });
      if (dentalIssues) profileData.medicalHistory.push({ condition: dentalIssues, notes: 'Previous Dental Issues' });
      await PatientProfile.create(profileData);
    } else if (user.role === 'clinic_admin') {
      const { clinicName, address, city, phone } = req.body;
      const Clinic = require('../models/Clinic');
      await Clinic.create({
        name: clinicName || `${user.lastName}'s Clinic`,
        admin: user._id,
        address: {
          street: address || 'Not provided',
          city: city || 'Not provided',
          state: 'Not provided',
          zipCode: '00000',
          country: 'Not provided'
        },
        location: { coordinates: [0, 0] },
        phone: phone || user.phone || '0000000000',
        email: user.email,
        licenseNumber: req.body.license || 'PENDING'
      });
    } else if (user.role === 'doctor') {
      const { specialty, experience, license } = req.body;
      const DoctorProfile = require('../models/DoctorProfile');
      await DoctorProfile.create({
        user: user._id,
        specialty: specialty || 'General Dentist',
        experience: experience || 0,
        licenseNumber: license || 'PENDING',
        status: 'pending'
      });
    }

    // ── FIX #10: Short-lived access token ──
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Refresh token for obtaining new access tokens
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // ── FIX #10: Short-lived access token ──
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// ── FIX #10: Refresh token endpoint ──
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or deactivated'
      });
    }

    // Issue new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      success: true,
      token: accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// ── FIX #10: Logout - blacklist tokens ──
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Blacklist the current access token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      tokenBlacklist.add(token);
    }

    // Also blacklist the refresh token if provided
    const { refreshToken } = req.body;
    if (refreshToken) {
      tokenBlacklist.add(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ user: req.userId })
        .populate('complaints');
    }

    res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, email, dob, gender, allergies } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    await user.save();

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ user: user._id });
      if (profile) {
        if (dob) profile.dateOfBirth = new Date(dob);
        if (gender) profile.gender = gender.toLowerCase();
        if (allergies) {
          profile.allergies = Array.isArray(allergies) 
            ? allergies 
            : allergies.split(',').map(s => s.trim());
        }
        await profile.save();
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      },
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
