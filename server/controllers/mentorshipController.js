const mentorshipService = require('../services/mentorshipService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for Mentorship operations
 */

// @desc    Send mentorship request
exports.sendRequest = async (req, res) => {
  const mentorship = await mentorshipService.sendRequest(
    req.user.id, 
    req.user.name, 
    req.body.alumniId, 
    req.body.message
  );
  ApiResponse.success(res, 'Mentorship request sent successfully', mentorship, 201);
};

// @desc    Get user's mentorship requests
exports.getMyRequests = async (req, res) => {
  const requests = await mentorshipService.getMyRequests(req.user.id, req.user.role);
  ApiResponse.success(res, 'Requests fetched successfully', requests);
};

// @desc    Respond to mentorship request
exports.respondToRequest = async (req, res) => {
  const mentorship = await mentorshipService.respondToRequest(
    req.params.id, 
    req.user.id, 
    req.body.status
  );
  ApiResponse.success(res, `Request ${req.body.status.toLowerCase()} successfully`, mentorship);
};
