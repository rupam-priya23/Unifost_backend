const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

/* validation rules reused for register */
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').isMobilePhone().withMessage('Valid phone required'),
  body('dob').isISO8601().toDate(),
  body('gender').isIn(['male', 'female', 'other']),
  body('course').notEmpty(),
  body('password').isLength({ min: 6 }),
];

/* /api/auth */
router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
