require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const clinicRoutes = require('./routes/clinics');
const appointmentRoutes = require('./routes/appointments');
const imageRoutes = require('./routes/images');
const chatRoutes = require('./routes/chat');
const reviewRoutes = require('./routes/reviews');
const complaintRoutes = require('./routes/complaints');
const reportRoutes = require('./routes/reports');

const app = express();
const server = http.createServer(app);

// Socket.IO setup for real-time chat
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance for use in routes
app.set('io', io);

// ── FIX #5: Rate Limiting (Increased for Development) ──
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for dev
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for dev
  message: { success: false, message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Increased for dev
  message: { success: false, message: 'Too many registration attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply global rate limiter
app.use(globalLimiter);

// ── FIX #1: CORS - Removed manual wildcard middleware, using cors library only ──
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:5173'
    ];
    // Allow requests with no origin (server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS policy: Origin not allowed' });
  }
  next(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ── FIX #2: MongoDB Connection - Do NOT log credentials ──
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dentai';
mongoose.connect(mongoUri)
  .then(() => {
    // Log connection success WITHOUT exposing the full URI (contains credentials)
    const dbName = mongoUri.split('/').pop()?.split('?')[0] || 'database';
    console.log('MongoDB Connected Successfully to:', dbName);
  })
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

// Routes with rate limiters for auth endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reports', reportRoutes);

// AI Analysis endpoint (direct)
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const aiService = require('./services/aiService');
    res.json({
      success: true,
      message: 'Use /api/images/upload endpoint for AI analysis with image upload'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI analysis service unavailable'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dent AI API is running',
    timestamp: new Date().toISOString()
  });
});

// ── FIX #4 & #8: Socket.IO with JWT Authentication ──
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { userId, role }
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user?.userId;
  console.log('User connected:', userId, 'Socket:', socket.id);

  // Store user-to-socket mapping
  socket.data.userId = userId;

  // Join a chat room (for two users)
  socket.on('joinChat', ({ otherUserId }) => {
    // FIX #8: Use authenticated userId, not client-provided
    const roomName = [String(userId), String(otherUserId)].sort().join('_');
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    // FIX #8: Use authenticated userId from JWT, not client-provided senderId
    const { receiverId, message } = data;
    const roomName = [String(userId), String(receiverId)].sort().join('_');

    if (!receiverId || !message) {
      return;
    }

    try {
      const ChatMessage = require('./models/ChatMessage');
      const chatMessage = new ChatMessage({
        sender: userId,        // Use server-verified identity
        receiver: receiverId,
        message
      });

      await chatMessage.save();

      // Emit to room
      io.to(roomName).emit('newMessage', {
        _id: chatMessage._id,
        sender: userId,        // Verified sender
        receiver: receiverId,
        message,
        createdAt: chatMessage.createdAt
      });
    } catch (error) {
      console.error('Socket send message error:', error.message);
    }
  });

  // Typing indicator
  socket.on('typing', ({ otherUserId, isTyping }) => {
    const roomName = [String(userId), String(otherUserId)].sort().join('_');
    socket.to(roomName).emit('userTyping', { userId, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', userId, 'Socket:', socket.id);
  });
});

// ── FIX #13: Global error handler - Sanitize error messages in production ──
app.use((err, req, res, next) => {
  // Log full error server-side
  console.error('Error:', err.stack);

  const isDev = process.env.NODE_ENV === 'development';
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: isDev ? err.message : 'An internal server error occurred. Please try again later.',
    ...(isDev ? { stack: err.stack } : {})
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Dent AI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
