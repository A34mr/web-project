require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

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
    methods: ['GET', 'POST']
  }
});

// Store io instance for use in routes
app.set('io', io);

// Middleware - Add CORS headers to ALL responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
      'null' // Allow requests with no origin (like mobile apps or curl requests)
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dentai';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Connected Successfully ->', mongoUri))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// Routes
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
    // This would need file upload handling - using the images route is preferred
    res.json({
      success: true,
      message: 'Use /api/images/upload endpoint for AI analysis with image upload'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a chat room (for two users)
  socket.on('joinChat', ({ userId, otherUserId }) => {
    const roomName = [userId, otherUserId].sort().join('_');
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
    const roomName = [senderId, receiverId].sort().join('_');
    
    try {
      const ChatMessage = require('./models/ChatMessage');
      const chatMessage = new ChatMessage({
        sender: senderId,
        receiver: receiverId,
        message
      });
      
      await chatMessage.save();
      
      // Emit to room
      io.to(roomName).emit('newMessage', {
        _id: chatMessage._id,
        sender: senderId,
        receiver: receiverId,
        message,
        createdAt: chatMessage.createdAt
      });
    } catch (error) {
      console.error('Socket send message error:', error);
    }
  });

  // Typing indicator
  socket.on('typing', ({ userId, otherUserId, isTyping }) => {
    const roomName = [userId, otherUserId].sort().join('_');
    socket.to(roomName).emit('userTyping', { userId, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
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
  console.log(`🚀 Dent AI Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
