const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { getIO, emitNotification } = require('../socket');

/**
 * Service to handle Job related business logic
 */
class JobService {
  /**
   * Get all jobs with filters and pagination
   */
  async getJobs(filters) {
    const { keyword, company, type, page = 1, limit = 10 } = filters;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (company) query.company = { $regex: company, $options: 'i' };
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email profile.company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      jobs,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    };
  }

  /**
   * Get single job by ID
   */
  async getJobById(id) {
    const job = await Job.findById(id).populate('postedBy', 'name email profile.company');
    if (!job) throw new Error('Job not found');
    return job;
  }

  /**
   * Create a job
   */
  async createJob(jobData, userId) {
    const job = await Job.create({
      ...jobData,
      postedBy: userId
    });

    // Notify all users in real-time about the new opportunity
    const io = getIO();
    io.emit('new_notification', {
      type: 'NewJob',
      message: `New Job Opportunity: ${job.title} at ${job.company}`,
      relatedId: job._id
    });

    return job;
  }

  /**
   * Apply for a job
   */
  async applyForJob(jobId, studentId) {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    const alreadyApplied = job.applications.find(
      (app) => app.student.toString() === studentId.toString()
    );

    if (alreadyApplied) {
      throw new Error('Already applied for this job');
    }

    job.applications.push({ student: studentId });
    await job.save();

    // Notify the job poster
    const notification = await Notification.create({
      recipient: job.postedBy,
      sender: studentId,
      type: 'ApplicationStatus',
      message: `A new application has been received for your posting: ${job.title}`,
      relatedId: job._id
    });
    
    emitNotification(job.postedBy, notification);

    return job;
  }
}

module.exports = new JobService();
