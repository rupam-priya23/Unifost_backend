// Load environment variables early
require('dotenv').config();

// Core dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const leadRoutes = require('./routes/LeadRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Initialize Express app
const app = express();

// Environment variables with fallbacks
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Handle multiple CORS origins for different environments
const corsOrigins = FRONTEND_URL.split(',').map(origin => origin.trim());

// ─────── Middleware ───────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in the allowed list
    if (corsOrigins.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging in development
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ─────── Routes ───────
app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/health', healthRoutes);

// ─────── Root Route (API Status) ───────
app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running ✅',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    documentation: '/api-docs'
  });
});

// Import error handler middleware
const errorHandler = require('./Middleware/errorHandler');

// ─────── 404 Handler ───────
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// ─────── Global Error Handler ───────
app.use(errorHandler);

// ─────── MongoDB Connection & Server Start ───────
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server Running:
   - Environment: ${NODE_ENV}
   - URL: http://localhost:${PORT}
   - CORS Allowed Origins: ${corsOrigins.join(', ')}
      `);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
