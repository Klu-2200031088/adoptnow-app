const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Orphanage = require('../models/Orphanage');

router.get('/counts', async (req, res) => {
  try {
    const hospitalCount = await Hospital.countDocuments();
    const orphanageCount = await Orphanage.countDocuments();

    res.json({ hospitalCount, orphanageCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching counts' });
  }
});

module.exports = router;
