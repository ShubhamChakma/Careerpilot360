import env from '../config/env.js';

export default function errorHandler(err, req, res, next) {
  console.error('💥 Global Error Handler Catch:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}
