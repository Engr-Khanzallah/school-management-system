const express = require('express');
const router = express.Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignSubjectTeacher,
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);
router.post('/:id/subjects', authorize('admin'), assignSubjectTeacher);

module.exports = router;
