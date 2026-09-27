const mongoose = require('mongoose');

const examSubjectSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    maxMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 33 },
    date: { type: Date },
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Mid-Term 2026"
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String },
    subjects: [examSubjectSchema],
    startDate: { type: Date },
    endDate: { type: Date },
    resultsPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
