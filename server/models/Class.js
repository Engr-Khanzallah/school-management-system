const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  },
  { _id: false }
);

const timetableSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    period: { type: Number, required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false }
);

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "10"
    sections: [{ type: String, trim: true }], // e.g. ["A", "B"]
    subjects: [subjectSchema],
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    timetable: [timetableSlotSchema],
  },
  { timestamps: true }
);

classSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
