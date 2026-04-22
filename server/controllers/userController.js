const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for User operations
 */

// @desc    Get all users (Alumni Directory)
exports.getUsers = async (req, res) => {
  const result = await userService.getUsers(req.query);
  ApiResponse.success(res, 'Directory fetched successfully', result);
};

// @desc    Get user profile by ID
exports.getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, 'User profile fetched', user);
};

// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, 'Profile updated successfully', updatedUser);
};

// @desc    Get stats for admin dashboard
exports.getStats = async (req, res) => {
  const stats = await userService.getStats();
  ApiResponse.success(res, 'Stats fetched successfully', stats);
};

// @desc    Delete user
exports.deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  ApiResponse.success(res, 'User deleted successfully', result);
};
