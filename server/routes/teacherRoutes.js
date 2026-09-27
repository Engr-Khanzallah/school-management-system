const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', authorize('admin'), createTeacher);
router.put('/:id', authorize('admin', 'teacher'), updateTeacher);
router.delete('/:id', authorize('admin'), deleteTeacher);

module.exports = router;
