const Exam = require('../models/Exam');

const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

const getExams = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;

    const exams = await Exam.find(filter).populate('class', 'name sections').sort({ startDate: -1 });
    res.json(exams);
  } catch (error) {
    next(error);
  }
};

const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('class', 'name sections');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExam, getExams, getExamById, updateExam, deleteExam };
