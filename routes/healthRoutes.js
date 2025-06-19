const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// API status route
router.get('/', healthController.healthCheck);

// Database connection status
router.get('/db', healthController.dbCheck);

module.exports = router;
