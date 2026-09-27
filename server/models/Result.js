const mongoose = require('mongoose');

const marksEntrySchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    marks: [marksEntrySchema],
    totalMarks: { type: Number },
    maxTotalMarks: { type: Number },
    percentage: { type: Number },
    grade: { type: String },
    status: { type: String, enum: ['pass', 'fail'], default: 'pass' },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

function gradeFromPercentage(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  if (pct >= 33) return 'E';
  return 'F';
}

resultSchema.pre('save', function (next) {
  const totalMarks = this.marks.reduce((sum, m) => sum + m.marksObtained, 0);
  const maxTotalMarks = this.marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const percentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;

  this.totalMarks = totalMarks;
  this.maxTotalMarks = maxTotalMarks;
  this.percentage = Math.round(percentage * 100) / 100;
  this.grade = gradeFromPercentage(this.percentage);
  this.status = this.percentage >= 33 ? 'pass' : 'fail';
  next();
});

resultSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
