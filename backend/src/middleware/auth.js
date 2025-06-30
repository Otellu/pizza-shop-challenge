const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to validate JWT token and attach user to request.
 * - Expects token in `Authorization: Bearer <token>` header.
 * - Verifies token using JWT_SECRET.
 * - Attaches user to `req.user` if valid.
 * - Returns 401 with specific error messages for different failure cases:
 *   - No token provided
 *   - Invalid token format
 *   - Token verification failed
 *   - User not found
 */
const validateToken = async (req, res, next) => {
  // TODO: Implement JWT validation with error handling
  next();
};

module.exports = validateToken;
