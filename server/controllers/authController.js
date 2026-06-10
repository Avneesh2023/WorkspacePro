const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields (name, email, password)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please add all required fields (email, password)' });
    }

    // Find user
    const user = await User.findOne({ email });

    // Verify password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
