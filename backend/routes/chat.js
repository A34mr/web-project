const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { authMiddleware } = require('../middleware/auth');

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, message, appointmentId } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver and message are required' 
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receiver not found' 
      });
    }

    const chatMessage = new ChatMessage({
      sender: req.userId,
      receiver: receiverId,
      message,
      appointment: appointmentId || null
    });

    await chatMessage.save();

    // Emit socket event if socket.io is available
    if (req.app.get('io')) {
      const io = req.app.get('io');
      const roomName = [req.userId, receiverId].sort().join('_');
      io.to(roomName).emit('newMessage', {
        _id: chatMessage._id,
        sender: req.userId,
        receiver: receiverId,
        message,
        createdAt: chatMessage.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent',
      chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message'
    });
  }
});

// Get conversation with specific user
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    })
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        sender: req.params.userId,
        receiver: req.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get conversation error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversation'
    });
  }
});

// Get all conversations (chat list)
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    // Get unique users who have chatted with current user
    const sentMessages = await ChatMessage.aggregate([
      { $match: { sender: req.userId } },
      { $group: { _id: '$receiver' } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          avatar: '$user.avatar',
          lastMessageAt: 1
        }
      }
    ]);

    const receivedMessages = await ChatMessage.aggregate([
      { $match: { receiver: req.userId } },
      { $group: { _id: '$sender' } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          avatar: '$user.avatar',
          lastMessageAt: 1
        }
      }
    ]);

    // Combine and get latest message for each conversation
    const allContacts = [...sentMessages, ...receivedMessages];
    const uniqueContacts = [];
    const seen = new Set();

    for (const contact of allContacts) {
      if (!seen.has(contact._id.toString())) {
        seen.add(contact._id.toString());
        
        // Get latest message
        const latestMessage = await ChatMessage.findOne({
          $or: [
            { sender: req.userId, receiver: contact._id },
            { sender: contact._id, receiver: req.userId }
          ]
        }).sort({ createdAt: -1 });

        // Count unread messages
        const unreadCount = await ChatMessage.countDocuments({
          sender: contact._id,
          receiver: req.userId,
          isRead: false
        });

        uniqueContacts.push({
          ...contact,
          lastMessage: latestMessage,
          unreadCount
        });
      }
    }

    // Sort by last message date
    uniqueContacts.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt || new Date(0);
      const dateB = b.lastMessage?.createdAt || new Date(0);
      return dateB - dateA;
    });

    res.json({
      success: true,
      count: uniqueContacts.length,
      conversations: uniqueContacts
    });
  } catch (error) {
    console.error('Get conversations error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversations'
    });
  }
});

// Get unread message count
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      receiver: req.userId,
      isRead: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get unread count'
    });
  }
});

module.exports = router;
