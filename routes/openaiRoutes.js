// routes/openaiRoutes.js
const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/openaiService');

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required' });
  }

  try {
    const response = await getChatResponse(prompt);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
