const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  requestAdoption,
  getRequestsForInstitution,
  updateAdoptionStatus
} = require('../controllers/adoptionController');

// Parents can request
router.post('/request', verifyToken, requestAdoption);

// Institution admin views their requests
router.get('/institution', verifyToken, getRequestsForInstitution);

// Admin updates request status
router.put('/:id/status', verifyToken, updateAdoptionStatus);

module.exports = router;
