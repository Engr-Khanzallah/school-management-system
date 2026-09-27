const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    subjects: [{ type: String, trim: true }],
    qualification: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    contactNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    joiningDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
