const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ─── Public Routes (Read-only) ───
router.get('/all', ctrl.getCourses);
router.get('/search', ctrl.searchCourses);
router.get('/getById/:id', ctrl.getById);
router.get('/getByCategory', ctrl.getByCategory);
router.get('/getByInstructor', ctrl.getByInstructor);

// ─── Private Routes (Admin only) ───
router.use(protect, authorize(['admin']));

router.post('/add', ctrl.createCourse);
router.put('/update/:id', ctrl.updateCourse);
router.delete('/delete/:id', ctrl.deleteCourse);

module.exports = router;
