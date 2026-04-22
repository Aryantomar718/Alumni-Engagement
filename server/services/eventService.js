const Event = require('../models/Event');
const { getIO } = require('../socket');

/**
 * Service to handle Event related business logic
 */
class EventService {
  /**
   * Get all events with filters and pagination
   */
  async getEvents(filters) {
    const { keyword, type, page = 1, limit = 10 } = filters;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      events,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    };
  }

  /**
   * Get single event by ID
   */
  async getEventById(id) {
    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) throw new Error('Event not found');
    return event;
  }

  /**
   * Create an event
   */
  async createEvent(eventData, userId) {
    const event = await Event.create({
      ...eventData,
      organizer: userId
    });

    // Notify all users in real-time about the new event
    const io = getIO();
    io.emit('new_notification', {
      type: 'EventInvite',
      message: `New Event: ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
      relatedId: event._id
    });

    return event;
  }

  /**
   * RSVP for an event
   */
  async rsvpEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    if (event.attendees.includes(userId)) {
      throw new Error('Already RSVPed');
    }

    event.attendees.push(userId);
    return await event.save();
  }
}

module.exports = new EventService();
