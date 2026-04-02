const Feedback = require('../models/Feedback');
const axios = require('axios');

// --- Helper: Jib l-ID dial l-cours b smoytu ---
const getCourseId = async (title) => {
  const res = await axios.get(`${process.env.COURS_SERVICE_URL}/search?title=${encodeURIComponent(title)}`);
  return res.data?.data?.[0]?._id;
};

// --- 1. Get All Feedbacks ---
exports.getAllFeedbacks = async (req, res) => {
  try {
    const data = await Feedback.find();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- 2. Feedbacks by Course Title ---
exports.getFeedbacksByCourseTitle = async (req, res) => {
  try {
    const id_cours = await getCourseId(req.params.coursTitle);
    if (!id_cours) return res.status(404).json({ success: false, error: 'Cours introuvable' });
    const data = await Feedback.find({ id_cours });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- 3. Add Feedback ---
exports.addFeedbackByTitle = async (req, res) => {
  try {
    const id_cours = await getCourseId(req.params.coursTitle);
    if (!id_cours) return res.status(404).json({ success: false, error: 'Cours introuvable' });
    const data = await Feedback.create({ ...req.body, id_cours, id_etudiant: req.user.id });
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};

// --- 4. Update / Delete (Admin) ---
exports.updateFeedbackByTitle = async (req, res) => {
  try {
    const data = await Feedback.findByIdAndUpdate(req.body.id_feedback, req.body, { new: true });
    res.json({ success: true, data });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
};

exports.deleteFeedbackByTitle = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.body.id_feedback);
    res.json({ success: true, message: 'Feedback supprimé' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- 5. Discovery & User Feedbacks ---
exports.getTopCourses = async (req, res) => {
  try {
    // 1. On cherche tous les IDs de cours qui ont au moins une note de 5
    const feedbackIds = await Feedback.find({ note: 5 }).distinct('id_cours');
    
    // 2. On récupère les détails de chaque cours depuis le microservice Cours
    const coursePromises = feedbackIds.map(async (id) => {
      try {
        const response = await axios.get(`${process.env.COURS_SERVICE_URL}/getById/${id}`);
        return response.data.data;
      } catch (err) {
        return null;
      }
    });

    const courses = (await Promise.all(coursePromises)).filter(c => c !== null);
    
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentFeedback = async (req, res) => {
  const data = await Feedback.find({ id_etudiant: req.user.id });
  res.json({ success: true, data });
};
