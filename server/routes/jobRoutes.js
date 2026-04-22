const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJobById, 
  createJob, 
  applyForJob 
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('Alumni', 'Admin'), createJob);
router.post('/:id/apply', protect, authorize('Student'), applyForJob);

module.exports = router;
