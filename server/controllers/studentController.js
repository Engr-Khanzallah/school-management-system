const Student = require('../models/Student');

// @desc  Create a student
// @route POST /api/students
// @access Private (admin)
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc  List students (optionally filtered by class/section)
// @route GET /api/students?class=&section=
// @access Private (admin, teacher)
const getStudents = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;

    const students = await Student.find(filter)
      .populate('class', 'name sections')
      .sort({ rollNo: 1 });

    res.json(students);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single student
// @route GET /api/students/:id
// @access Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name sections');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// @desc  Update a student
// @route PUT /api/students/:id
// @access Private (admin)
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete (deactivate) a student
// @route DELETE /api/students/:id
// @access Private (admin)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
