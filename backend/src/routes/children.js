const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Orphan = require('../models/Orphan');


// Create orphan with photo
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, age, location } = req.body;
    const photoUrl = req.file ? req.file.filename : '';

    const newOrphan = new Orphan({
      name,
      age,
      location,
      photoUrl,
      addedBy: req.user.id,
      adopted: false, // Explicitly mark new orphan as not adopted
    });

    await newOrphan.save();
    res.status(201).json(newOrphan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add orphan', error: err.message });
  }
});

// Get all orphans added by logged in admin (include adopted orphans)
router.get('/', auth, async (req, res) => {
  try {
    const orphans = await Orphan.find({ addedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(orphans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orphans', error: err.message });
  }
});

// Public: Get only unadopted orphans (for public listing)
router.get('/public', async (req, res) => {
  try {
    const orphans = await Orphan.find({ adopted: false })
      .sort({ createdAt: -1 })
      .populate({
        path: 'addedBy',
        select: 'role hospital orphanage fullName',
        populate: [
          { path: 'hospital', select: 'name' },
          { path: 'orphanage', select: 'name' }
        ]
      });

    // Transform response to include hospital/orphanage name directly
    const orphansWithOrg = orphans.map(o => {
      const user = o.addedBy || {};
      let orgName = null;
      if (user.role === 'hospital' && user.hospital) {
        orgName = user.hospital.name;
      } else if (user.role === 'admin' && user.orphanage) {
        orgName = user.orphanage.name;
      }

      return {
        _id: o._id,
        name: o.name,
        age: o.age,
        location: o.location,
        photoUrl: o.photoUrl,
        createdAt: o.createdAt,
        organizationName: orgName,
        addedByName: user.fullName,
      };
    });

    res.json(orphansWithOrg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orphans', error: err.message });
  }
});


// Delete orphan by id (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const orphan = await Orphan.findById(req.params.id);
    if (!orphan) return res.status(404).json({ message: 'Orphan not found' });

    // Only the admin who added can delete
    if (orphan.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await orphan.remove();
    res.json({ message: 'Orphan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete orphan', error: err.message });
  }
});

// Optional: Mark orphan as adopted
router.patch('/:id/adopt', auth, async (req, res) => {
  try {
    const orphan = await Orphan.findById(req.params.id);
    if (!orphan) return res.status(404).json({ message: 'Orphan not found' });

    // Only admin who added can update
    if (orphan.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    orphan.adopted = true;
    await orphan.save();
    res.json(orphan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as adopted', error: err.message });
  }
});

module.exports = router;
