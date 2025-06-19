const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  university: { type: String, default: 'Not specified', trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
