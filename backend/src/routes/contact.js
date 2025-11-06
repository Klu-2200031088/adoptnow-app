// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ message: 'Message received, thank you!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

module.exports = router;
