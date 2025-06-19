const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true 
  },
  course: { 
    type: String, 
    required: [true, 'Course is required'],
    trim: true 
  },
  university: { 
    type: String, 
    default: 'Not specified',
    trim: true 
  },
  message: { 
    type: String, 
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'closed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
