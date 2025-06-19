/**
 * Global error handler middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', err);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = {};
    
    // Format validation errors
    Object.keys(err.errors).forEach(field => {
      errors[field] = err.errors[field].message;
    });
    
    return res.status(statusCode).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists. Please use another value.`;
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  
  // Handle expired JWT
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }
  
  // Hide error details in production
  const error = {
    success: false,
    message
  };
  
  // Include stack trace in development mode
  if (process.env.NODE_ENV !== 'production') {
    error.stack = err.stack;
  }
  
  res.status(statusCode).json(error);
};

module.exports = errorHandler;
