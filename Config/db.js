const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string is missing! Check your environment variables.');
    }
    
    // Connect with improved options for production
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't exit in production, let the application try to reconnect
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed but service will continue to retry connecting');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
