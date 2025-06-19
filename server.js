require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db');

const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─────── Middleware ───────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL, // Frontend URL from env
  credentials: true,
}));

// ─────── Routes ───────
app.use('/api/auth', authRoutes);
app.use('/api', enquiryRoutes); // 🟢 Enquiry routes included

// ─────── Test Route ───────
app.get('/', (req, res) => {
  res.send('API is running ✅');
});

// ─────── Global Error Handler ───────
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ─────── MongoDB Connection & Server Start ───────
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
