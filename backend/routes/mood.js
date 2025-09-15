const express = require('express');
const router = express.Router();
const MoodLog = require('../models/MoodLog');

// Temporary debug route: Return all mood logs as JSON
router.get('/debug/all', async (req, res) => {
  try {
    const MoodLog = require('../models/MoodLog');
    const allLogs = await MoodLog.find({});
    res.json({ success: true, logs: allLogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save mood
router.post('/', async (req, res) => {
  try {
    const { user, mood } = req.body;
    if (!user || !mood) return res.status(400).json({ success: false, error: 'User and mood required' });
    const moodLog = new MoodLog({ user, mood });
    await moodLog.save();
    res.status(201).json({ success: true, data: moodLog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get latest mood for user
router.get('/:userId/latest', async (req, res) => {
  try {
    const latestMood = await MoodLog.findOne({ user: req.params.userId }).sort({ timestamp: -1 });
    res.json({ success: true, data: latestMood });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
