require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// ─────── Middleware ───────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL (Vite)
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

// ─────── MongoDB Connection ───────
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
