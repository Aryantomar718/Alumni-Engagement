const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  message: {
    type: String,
    required: [true, 'Mentorship request message is required']
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  responseDate: Date
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
