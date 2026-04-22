const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateProfile, 
  getStats,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), getUsers);
router.get('/stats', protect, authorize('Admin'), getStats);
router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
