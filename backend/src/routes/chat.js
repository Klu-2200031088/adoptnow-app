const express = require('express');
const Chat = require('../models/Chat');

const router = express.Router();

// GET all messages for a specific room
router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Chat.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;
