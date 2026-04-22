const Message = require('../models/Message');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for Chat operations
 */

// @desc    Get conversation history between current user and another user
// @route   GET /api/chat/messages/:userId
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, recipient: userId },
      { sender: userId, recipient: currentUserId }
    ]
  }).sort({ createdAt: 1 });

  ApiResponse.success(res, 'Messages fetched', messages);
};

// @desc    Save a new message (usually called via socket, but keep for fallback/API)
// @route   POST /api/chat/messages
exports.saveMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  
  const newMessage = await Message.create({
    sender: req.user.id,
    recipient: recipientId,
    content
  });

  ApiResponse.success(res, 'Message saved', newMessage, 201);
};

// @desc    Get list of users with whom the current user has chatted
// @route   GET /api/chat/users
exports.getChatUsers = async (req, res) => {
  const currentUserId = req.user.id;

  // Find unique senders/recipients for the current user
  const sentMessages = await Message.distinct('recipient', { sender: currentUserId });
  const receivedMessages = await Message.distinct('sender', { recipient: currentUserId });
  
  const userIds = [...new Set([...sentMessages, ...receivedMessages])];
  
  const users = await User.find({ _id: { $in: userIds } }).select('name role profileImage');
  
  ApiResponse.success(res, 'Chat users fetched', users);
};
