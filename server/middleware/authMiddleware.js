const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token from the header ("Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database by decoded token payload ID
      // Exclude password from the attached user object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 5. Pass control to the next middleware or route handler
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      // Return 401 if token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. Return 401 if token is completely missing in authorization headers
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
