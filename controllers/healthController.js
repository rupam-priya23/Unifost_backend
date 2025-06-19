const mongoose = require('mongoose');

/**
 * Health check controller
 * Provides endpoints to verify API and database health
 */

// Basic API health check
exports.healthCheck = (req, res) => {
  const healthStatus = {
    status: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime() + ' seconds'
  };

  res.json(healthStatus);
};

// MongoDB connection check
exports.dbCheck = async (req, res) => {
  try {
    // Check MongoDB connection state
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const dbInfo = {
      status: states[dbState] || 'unknown',
      connected: dbState === 1,
      host: mongoose.connection.host || 'unavailable',
      name: mongoose.connection.name || 'unavailable'
    };

    if (dbState === 1) {
      // Database is connected
      return res.json({
        success: true,
        database: dbInfo,
        message: 'Database connection is healthy'
      });
    } else {
      // Database is not connected
      return res.status(503).json({
        success: false,
        database: dbInfo,
        message: 'Database connection is not established'
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};
