const express = require('express');
const router = express.Router();
const {
  markAttendance,
  updateAttendance,
  getAttendance,
  getAttendancePercentage,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAttendance);
router.get('/percentage/:studentId', getAttendancePercentage);
router.post('/', authorize('admin', 'teacher'), markAttendance);
router.put('/:id', authorize('admin', 'teacher'), updateAttendance);

module.exports = router;
