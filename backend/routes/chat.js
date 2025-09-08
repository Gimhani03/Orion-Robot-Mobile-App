const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Simple in-memory storage for chat history (replace with MongoDB in production)
const chatHistories = new Map();

// @desc    Get chat history for user
// @route   GET /api/chat/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = chatHistories.get(userId) || [];
    
    res.json({
      success: true,
      data: {
        messages: history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history'
    });
  }
});

// @desc    Save chat message
// @route   POST /api/chat/message
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { text, isBot, timestamp } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    const message = {
      id: Date.now().toString(),
      text,
      isBot: !!isBot,
      timestamp: timestamp || new Date().toISOString(),
      userId
    };

    // Get existing history or create new
    const history = chatHistories.get(userId) || [];
    history.push(message);
    
    // Keep only last 50 messages
    if (history.length > 50) {
      history.shift();
    }
    
    chatHistories.set(userId, history);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat message'
    });
  }
});

// @desc    Clear chat history for user
// @route   DELETE /api/chat/history
// @access  Private
router.delete('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    chatHistories.delete(userId);
    
    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history'
    });
  }
});

// @desc    Get chat statistics
// @route   GET /api/chat/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = chatHistories.get(userId) || [];
    
    const userMessages = history.filter(msg => !msg.isBot);
    const botMessages = history.filter(msg => msg.isBot);
    
    const stats = {
      totalMessages: history.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      lastActivity: history.length > 0 ? history[history.length - 1].timestamp : null,
      averageMessageLength: history.length > 0 
        ? Math.round(history.reduce((sum, msg) => sum + msg.text.length, 0) / history.length)
        : 0
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting chat stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat statistics'
    });
  }
});

module.exports = router;
