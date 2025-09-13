// middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt';

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach user id to request
    req.userId = decoded.id;
    // optionally fetch user
    req.user = await User.findById(decoded.id).select('-passwordHash');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token', error: err.message });
  }
};

module.exports = authMiddleware;
