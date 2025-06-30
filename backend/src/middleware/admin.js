const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to verify admin access
 * - Expects valid JWT in Authorization header
 * - Verifies token and checks if user has admin role
 * - Attaches user to req.user if authorized
 * - Returns 401 for invalid/expired tokens
 * - Returns 403 for non-admin users
 */
module.exports = async function admin(req, res, next) {
  // TODO: Validate the token and allow only admin users to continue 
  // TODO: Implement proper error handling 

  next();
};
