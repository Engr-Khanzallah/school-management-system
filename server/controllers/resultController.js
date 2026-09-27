const Result = require('../models/Result');
const Exam = require('../models/Exam');

// @desc  Enter/update marks for a student in an exam (total/percentage/grade auto-calculated)
// @route POST /api/results
const upsertResult = async (req, res, next) => {
  try {
    const { exam, student, marks, remarks } = req.body;

    let result = await Result.findOne({ exam, student });
    if (result) {
      result.marks = marks;
      result.remarks = remarks;
      await result.save();
    } else {
      result = await Result.create({ exam, student, marks, remarks });
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all results for an exam (class-wide report)
// @route GET /api/results/exam/:examId
const getResultsByExam = async (req, res, next) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', 'name rollNo section')
      .sort({ percentage: -1 });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a student's report card for one exam
// @route GET /api/results/report-card/:studentId/:examId
const getReportCard = async (req, res, next) => {
  try {
    const result = await Result.findOne({
      student: req.params.studentId,
      exam: req.params.examId,
    })
      .populate('student', 'name rollNo section class')
      .populate('exam', 'name subjects startDate endDate');

    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc  Publish results for an exam (visible to students afterward)
// @route PATCH /api/results/publish/:examId
const publishResults = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.examId,
      { resultsPublished: true },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertResult, getResultsByExam, getReportCard, publishResults };
