const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Lead = require('../models/Lead'); // ✅ Import Lead model

/* Utility: sign & return token + cookie */
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
      },
    });
};

/* ───────── REGISTER ───────── */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, course, password } = req.body;

    // Check if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      phone,
      dob,
      gender,
      course,
      passwordHash,
    });
    await newUser.save();

    // ✅ Save lead information
    const newLead = new Lead({
      name,
      email,
      phone,
      course,
      university,
    });
    await newLead.save();

    res.status(201).json({ success: true, message: 'User registered and lead captured' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ───────── LOGIN ───────── */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ───────── LOGOUT ───────── */
exports.logout = (_, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
    .json({ success: true, message: 'Logged out' });
};
