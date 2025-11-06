const Child = require('../models/Child');

// Add new child (admin only)
exports.addChild = async (req, res) => {
  try {
    const child = new Child({ ...req.body, institution: req.user.id });
    await child.save();
    res.status(201).json({ message: 'Child profile created', child });
  } catch (error) {
    res.status(500).json({ message: 'Error creating child profile', error });
  }
};

// Get all children (public route)
exports.getAllChildren = async (req, res) => {
  try {
    const children = await Child.find({ isAvailable: true });
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children', error });
  }
};
