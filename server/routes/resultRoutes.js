const express = require('express');
const router = express.Router();
const {
  upsertResult,
  getResultsByExam,
  getReportCard,
  publishResults,
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), upsertResult);
router.get('/exam/:examId', authorize('admin', 'teacher'), getResultsByExam);
router.get('/report-card/:studentId/:examId', getReportCard);
router.patch('/publish/:examId', authorize('admin'), publishResults);

module.exports = router;
