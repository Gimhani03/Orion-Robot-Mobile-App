const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Create a reminder
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all reminders for a user
router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.params.userId });
    res.json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a reminder
router.put('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: reminder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
