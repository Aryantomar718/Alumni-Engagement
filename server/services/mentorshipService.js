const Mentorship = require('../models/Mentorship');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { emitNotification } = require('../socket');

/**
 * Service to handle Mentorship related business logic
 */
class MentorshipService {
  /**
   * Send a mentorship request
   */
  async sendRequest(studentId, studentName, alumniId, message) {
    // Check if alumniId is actually an alumni
    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== 'Alumni') {
      throw new Error('Selected user is not an alumni');
    }

    const mentorship = await Mentorship.create({
      student: studentId,
      alumni: alumniId,
      message
    });

    // Create notification entry
    const notification = await Notification.create({
      recipient: alumniId,
      sender: studentId,
      type: 'MentorshipRequest',
      message: `${studentName} sent you a mentorship request.`,
      relatedId: mentorship._id
    });

    // Emit real-time notification
    emitNotification(alumniId, notification);

    return mentorship;
  }

  /**
   * Get user's mentorship requests
   */
  async getMyRequests(userId, role) {
    const query = role === 'Alumni' 
      ? { alumni: userId } 
      : { student: userId };

    return await Mentorship.find(query)
      .populate('student', 'name email profile.skills')
      .populate('alumni', 'name email profile.company profile.industry')
      .sort({ requestedAt: -1 });
  }

  /**
   * Respond to mentorship request
   */
  async respondToRequest(requestId, alumniId, status) {
    if (!['Accepted', 'Rejected'].includes(status)) {
      throw new Error('Invalid status');
    }

    const mentorship = await Mentorship.findById(requestId);
    if (!mentorship) throw new Error('Request not found');

    if (mentorship.alumni.toString() !== alumniId.toString()) {
      throw new Error('Not authorized to respond to this request');
    }

    mentorship.status = status;
    mentorship.responseDate = Date.now();
    await mentorship.save();

    // Create notification for student
    const notification = await Notification.create({
      recipient: mentorship.student,
      sender: alumniId,
      type: 'MentorshipRequest',
      message: `Your mentorship request has been ${status.toLowerCase()}.`,
      relatedId: mentorship._id
    });

    // Emit real-time notification
    emitNotification(mentorship.student, notification);

    return mentorship;
  }
}

module.exports = new MentorshipService();
