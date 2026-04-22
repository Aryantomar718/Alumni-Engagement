const express = require('express');
const router = express.Router();
const { getMessages, saveMessage, getChatUsers } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/messages/:userId', protect, getMessages);
router.post('/messages', protect, saveMessage);
router.get('/users', protect, getChatUsers);

module.exports = router;
