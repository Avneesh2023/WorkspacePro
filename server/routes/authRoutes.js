const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { registerValidationRules, loginValidationRules } = require('../middleware/validationMiddleware');

// Routes
router.post('/register', registerValidationRules, registerUser);
router.post('/login', loginValidationRules, loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
