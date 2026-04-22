/**
 * Standard API Response Utility
 */
class ApiResponse {
  constructor(success, message, data = null) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
  }

  static success(res, message, data, status = 200) {
    return res.status(status).json(new ApiResponse(true, message, data));
  }

  static error(res, message, status = 500) {
    return res.status(status).json(new ApiResponse(false, message));
  }
}

module.exports = ApiResponse;
