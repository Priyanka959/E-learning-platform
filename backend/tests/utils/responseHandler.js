// Utility function for success responses
exports.successResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Utility function for error responses
exports.errorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

exports.APIError = APIError;