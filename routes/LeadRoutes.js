const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// ───── GET All Leads (for employees/admin) ─────
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (err) {
    console.error("Error fetching leads:", err.message);
    res.status(500).json({ success: false, message: "Error fetching leads" });
  }
});

// ───── POST a new Lead (optional, if needed separately) ─────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;

    const newLead = new Lead({ name, email, phone, course });
    await newLead.save();

    res.status(201).json({ success: true, message: "Lead saved successfully" });
  } catch (err) {
    console.error("Error saving lead:", err.message);
    res.status(500).json({ success: false, message: "Error saving lead" });
  }
});

module.exports = router;
