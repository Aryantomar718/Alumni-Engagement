const express = require('express');
const router = express.Router();
const { 
  sendRequest, 
  getMyRequests, 
  respondToRequest 
} = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-requests', protect, getMyRequests);
router.post('/request', protect, authorize('Student'), sendRequest);
router.put('/:id/respond', protect, authorize('Alumni'), respondToRequest);

module.exports = router;
