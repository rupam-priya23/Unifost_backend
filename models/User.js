const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
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
    dob: { 
      type: Date, 
      required: [true, 'Date of birth is required']
    },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: [true, 'Gender is required']
    },
    course: { 
      type: String, 
      required: [true, 'Course is required'],
      trim: true
    },
    passwordHash: { 
      type: String, 
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
