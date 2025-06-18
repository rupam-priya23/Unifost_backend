const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  university: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
