const eventService = require('../services/eventService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for Event operations
 */

// @desc    Get all events
exports.getEvents = async (req, res) => {
  const result = await eventService.getEvents(req.query);
  ApiResponse.success(res, 'Events fetched successfully', result);
};

// @desc    Get single event
exports.getEventById = async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  ApiResponse.success(res, 'Event details fetched', event);
};

// @desc    Create an event
exports.createEvent = async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user.id);
  ApiResponse.success(res, 'Event created successfully', event, 201);
};

// @desc    RSVP for an event
exports.rsvpEvent = async (req, res) => {
  await eventService.rsvpEvent(req.params.id, req.user.id);
  ApiResponse.success(res, 'Successfully RSVPed');
};
