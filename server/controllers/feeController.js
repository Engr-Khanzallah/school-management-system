const Fee = require('../models/Fee');

const createFeeRecord = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
};

const getFees = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.status) filter.status = req.query.status;

    const fees = await Fee.find(filter).populate('student', 'name rollNo').sort({ dueDate: 1 });
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// @desc  Record a payment against a fee record; generates a receipt number
// @route POST /api/fees/:id/pay
const recordPayment = async (req, res, next) => {
  try {
    const { amountPaid, paymentMethod } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    fee.amountPaid = (fee.amountPaid || 0) + Number(amountPaid);
    fee.paymentMethod = paymentMethod;
    fee.paidDate = new Date();
    fee.status = fee.amountPaid >= fee.amount ? 'paid' : 'partial';
    fee.receiptNumber = fee.receiptNumber || `RCPT-${Date.now()}`;

    await fee.save();
    res.json(fee);
  } catch (error) {
    next(error);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (error) {
    next(error);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json({ message: 'Fee record removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createFeeRecord, getFees, recordPayment, updateFee, deleteFee };
