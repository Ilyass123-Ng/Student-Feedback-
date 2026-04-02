const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ─── Protected Routes (Admins & Students) ───
router.use(protect);

router.get('/', ctrl.getAllFeedbacks);
router.get('/topCourses', ctrl.getTopCourses);
router.get('/getStudentFeedback', ctrl.getStudentFeedback);

router.route('/:coursTitle')
  .get(ctrl.getFeedbacksByCourseTitle)
  .post(ctrl.addFeedbackByTitle)
  .put(authorize(['admin']), ctrl.updateFeedbackByTitle)
  .delete(authorize(['admin']), ctrl.deleteFeedbackByTitle);

module.exports = router;
