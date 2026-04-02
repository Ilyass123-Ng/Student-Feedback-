const Course = require('../models/Course');

// 1-les cours (get);
exports.getCourses = async (req, res) => {
  try {
    const data = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// Search b l-title (L-b7t b smiya)
exports.searchCourses = async (req, res) => {
  try {
    const data = await Course.find({ title: new RegExp(req.query.title, 'i') });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// 2-Filtres Spécifiques
exports.getById = async (req, res) => {
  try {
    const data = await Course.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Cours introuvable' });
    res.json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: 'ID invalide' }); }
};

exports.getByCategory = async (req, res) => {
  try {
    const data = await Course.find({ category: req.query.category });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

exports.getByInstructor = async (req, res) => {
  try {
    const data = await Course.find({ instructor: req.query.instructor });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// 3-Mutations (Admin Only: Add, Update, Delete)
exports.createCourse = async (req, res) => {
  try {
    const data = await Course.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};

exports.updateCourse = async (req, res) => {
  try {
    const data = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Cours supprimé avec succès' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
