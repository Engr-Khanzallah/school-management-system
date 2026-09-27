const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeType: {
      type: String,
      enum: ['tuition', 'transport', 'hostel', 'exam', 'other'],
      required: true,
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partial'],
      default: 'pending',
    },
    amountPaid: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'online', 'cheque'] },
    receiptNumber: { type: String },
    academicYear: { type: String },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
