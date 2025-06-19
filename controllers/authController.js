const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Lead = require('../models/Lead'); // ✅ Import Lead model

/* Utility: sign & return token + cookie */
const sendToken = (user, statusCode, res) => {
  // Use JWT_EXPIRES_IN from env or default to 7 days
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  // Create token with user ID
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  // Calculate cookie expiration based on JWT expiration
  const cookieExpiration = expiresIn.includes('d') 
    ? parseInt(expiresIn) * 24 * 60 * 60 * 1000  // days to milliseconds
    : 24 * 60 * 60 * 1000; // default 1 day
  
  // Set cookie and send response
  res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: cookieExpiration,
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
    // Validate input with express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Extract user data from request
    const { name, email, phone, dob, gender, course, password, university = 'Not specified' } = req.body;

    // Check if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }

    // Hash password with bcrypt
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

    // Create and save lead information
    const newLead = new Lead({
      name,
      email,
      phone,
      course,
      university, // Use the university from the request or the default value
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
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user and check if exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate token and send response
    sendToken(user, 200, res);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

/* ───────── LOGOUT ───────── */
exports.logout = (_, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
    .json({ success: true, message: 'Logged out' });
};
