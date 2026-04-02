const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- 1. Inscription (Register) ---
exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    // Check ila l-mail déjà kayen (Vérifier si l'email existe)
    if (await User.findOne({ email })) return res.status(400).json({ success: false, error: 'Email déjà utilisé' });
    
    const data = await User.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};

// --- 2. Connexion (Login) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    // Vérifier password (N-qalbu l-mots de passe)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Identifiants invalides' });
    }

    // Générer Token JWT (Kriyé token li fih ID o Role)
    const token = jwt.sign({ id: user._id, role: user.role, nom: user.nom }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- 3. Profile Update ---
exports.updateProfile = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};
