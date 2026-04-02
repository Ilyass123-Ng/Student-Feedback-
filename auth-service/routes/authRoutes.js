const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.put('/updateProfile', protect, ctrl.updateProfile);

router.get('/profile', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
