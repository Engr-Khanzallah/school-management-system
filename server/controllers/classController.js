const Class = require('../models/Class');

const createClass = async (req, res, next) => {
  try {
    const schoolClass = await Class.create(req.body);
    res.status(201).json(schoolClass);
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'name')
      .populate('subjects.teacher', 'name');
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const schoolClass = await Class.findById(req.params.id)
      .populate('classTeacher', 'name')
      .populate('subjects.teacher', 'name');
    if (!schoolClass) return res.status(404).json({ message: 'Class not found' });
    res.json(schoolClass);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const schoolClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!schoolClass) return res.status(404).json({ message: 'Class not found' });
    res.json(schoolClass);
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const schoolClass = await Class.findByIdAndDelete(req.params.id);
    if (!schoolClass) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class removed' });
  } catch (error) {
    next(error);
  }
};

// @desc Assign or update a subject-teacher pairing on a class
// @route POST /api/classes/:id/subjects
const assignSubjectTeacher = async (req, res, next) => {
  try {
    const { subject, teacherId } = req.body;
    const schoolClass = await Class.findById(req.params.id);
    if (!schoolClass) return res.status(404).json({ message: 'Class not found' });

    const existing = schoolClass.subjects.find((s) => s.name === subject);
    if (existing) {
      existing.teacher = teacherId;
    } else {
      schoolClass.subjects.push({ name: subject, teacher: teacherId });
    }

    await schoolClass.save();
    res.json(schoolClass);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignSubjectTeacher,
};
