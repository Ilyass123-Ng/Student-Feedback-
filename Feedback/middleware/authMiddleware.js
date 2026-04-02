// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware bach n-vèrifiew l-token
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Pas de token, accès refusé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kan-zidou user l-req
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token invalide' });
  }
};

// Middleware bach n-vèrifiew l-role
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Accès interdit' });
    }
    next();
  };
};

module.exports = { protect, authorize };
