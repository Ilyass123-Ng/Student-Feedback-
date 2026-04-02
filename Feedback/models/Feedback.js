const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  id_cours:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  id_etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentaire: { type: String, required: true, trim: true },
  note:        { type: Number, required: true, min: 0, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
