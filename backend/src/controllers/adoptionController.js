const Adoption = require('../models/Adoption');
const Child = require('../models/Child');

// Parent submits a request
exports.requestAdoption = async (req, res) => {
  const { childId, message } = req.body;

  try {
    // Check if child exists
    const child = await Child.findById(childId);
    if (!child || !child.isAvailable) {
      return res.status(404).json({ message: 'Child not available' });
    }

    const adoption = new Adoption({
      parent: req.user.id,
      child: childId,
      message
    });

    await adoption.save();
    res.status(201).json({ message: 'Adoption request submitted', adoption });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting request', error: err });
  }
};

// Admin views all requests for their institution
exports.getRequestsForInstitution = async (req, res) => {
  try {
    const requests = await Adoption.find()
      .populate('child')
      .populate('parent');

    // Filter only for the institution's children
    const myRequests = requests.filter(r => 
      r.child.institution.toString() === req.user.id
    );

    res.status(200).json(myRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};

// Admin updates status
exports.updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await Adoption.findById(id).populate('child');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Check if user is the child's institution
    if (request.child.institution.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = status;
    await request.save();

    // If approved, mark child unavailable
    if (status === 'approved') {
      const child = await Child.findById(request.child._id);
      child.isAvailable = false;
      await child.save();
    }

    res.status(200).json({ message: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err });
  }
};
