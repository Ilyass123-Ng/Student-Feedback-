// middleware/authMiddleware.js
// Had l'fichier fih l'middleware li kayvèrifie wach l'user authenticated (protect) 
// w wach 3ndou l'role l'monassib (authorize).

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the decoded user information to the request object for use in controllers
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized, invalid or expired token' });
  }
};

// @desc    Middleware to authorize roles - checks if the logged-in user has one of the allowed roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Check if req.user exists (set by protect) and if their role is in the allowed roles array
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied: Role '${req.user ? req.user.role : 'unknown'}' does not have permission` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
