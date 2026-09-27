const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // login account, optional
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    parentName: { type: String, trim: true },
    parentContact: { type: String, trim: true },
    address: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    admissionDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.index({ rollNo: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
