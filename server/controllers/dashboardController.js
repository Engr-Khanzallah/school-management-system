const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');

// @desc  Aggregate dashboard stats
// @route GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalTeachers, upcomingExams, feeAggregation, todayAttendance] =
      await Promise.all([
        Student.countDocuments({ isActive: true }),
        Teacher.countDocuments({ isActive: true }),
        Exam.find({ startDate: { $gte: new Date() } }).sort({ startDate: 1 }).limit(5),
        Fee.aggregate([
          {
            $group: {
              _id: null,
              totalDue: { $sum: '$amount' },
              totalCollected: { $sum: '$amountPaid' },
            },
          },
        ]),
        Attendance.find({
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        }),
      ]);

    const presentToday = todayAttendance.filter(
      (a) => a.status === 'present' || a.status === 'late'
    ).length;
    const attendancePercentageToday =
      todayAttendance.length > 0
        ? Math.round((presentToday / todayAttendance.length) * 10000) / 100
        : 0;

    res.json({
      totalStudents,
      totalTeachers,
      attendancePercentageToday,
      upcomingExams,
      feeCollection: feeAggregation[0] || { totalDue: 0, totalCollected: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
