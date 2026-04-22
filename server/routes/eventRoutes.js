const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  rsvpEvent 
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('Admin'), createEvent);
router.post('/:id/rsvp', protect, rsvpEvent);

module.exports = router;
