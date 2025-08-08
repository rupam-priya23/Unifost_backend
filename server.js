require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db');
const errorHandler = require('./Middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const leadRoutes = require('./routes/LeadRoutes');
const healthRoutes = require('./routes/healthRoutes');
const openaiRoutes = require('./routes/openaiRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Build allowed origins array
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [];

// Add www. and non-www. variants automatically
const expandedOrigins = new Set();
allowedOrigins.forEach(origin => {
  expandedOrigins.add(origin);
  if (origin.includes('://www.')) {
    expandedOrigins.add(origin.replace('://www.', '://'));
  } else {
    const url = new URL(origin);
    expandedOrigins.add(`${url.protocol}//www.${url.hostname}${url.port ? ':' + url.port : ''}`);
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware to log request origins
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// Dynamic CORS handling
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (expandedOrigins.has(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Dev logging in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/health', healthRoutes);
app.use('/api/openai', openaiRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ status: 'API is running ✅' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server start error:', err);
    process.exit(1);
  }
};

startServer();
