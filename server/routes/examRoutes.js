const express = require('express');
const router = express.Router();
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getExams);
router.get('/:id', getExamById);
router.post('/', authorize('admin'), createExam);
router.put('/:id', authorize('admin'), updateExam);
router.delete('/:id', authorize('admin'), deleteExam);

module.exports = router;
