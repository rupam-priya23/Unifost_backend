const { required } = require("joi");
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  university: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  experience: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
