const jobService = require('../services/jobService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for Job operations
 */

// @desc    Get all jobs (with filters and pagination)
exports.getJobs = async (req, res) => {
  const result = await jobService.getJobs(req.query);
  ApiResponse.success(res, 'Jobs fetched successfully', result);
};

// @desc    Get single job
exports.getJobById = async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  ApiResponse.success(res, 'Job details fetched', job);
};

// @desc    Create a job
exports.createJob = async (req, res) => {
  const job = await jobService.createJob(req.body, req.user.id);
  // Trigger a real-time notification for a new job if we want
  // emitNotification('all', { type: 'NewJob', message: `New job posted: ${job.title}` });
  ApiResponse.success(res, 'Job created successfully', job, 201);
};

// @desc    Apply for a job
exports.applyForJob = async (req, res) => {
  await jobService.applyForJob(req.params.id, req.user.id);
  ApiResponse.success(res, 'Applied successfully');
};
