const Attendance = require('../models/Attendance');

// @desc  Mark attendance for a single student, or bulk-mark for a whole class/section/date
// @route POST /api/attendance
// body: { records: [{ student, class, section, date, status, remarks }, ...], markedBy }
const markAttendance = async (req, res, next) => {
  try {
    const { records, markedBy } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'records array is required' });
    }

    const results = await Promise.all(
      records.map((r) =>
        Attendance.findOneAndUpdate(
          { student: r.student, date: r.date },
          { ...r, markedBy },
          { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};

// @desc  Edit a single attendance record
// @route PUT /api/attendance/:id
const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(record);
  } catch (error) {
    next(error);
  }
};

// @desc  Attendance history for a class/section/date range
// @route GET /api/attendance?class=&section=&from=&to=
const getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;
    if (req.query.student) filter.student = req.query.student;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name rollNo')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc  Attendance percentage for one student
// @route GET /api/attendance/percentage/:studentId
const getAttendancePercentage = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId });
    const total = records.length;
    const present = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    const percentage = total > 0 ? Math.round((present / total) * 10000) / 100 : 0;

    res.json({ total, present, absent: total - present, percentage });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, updateAttendance, getAttendance, getAttendancePercentage };
