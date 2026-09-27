const express = require('express');
const router = express.Router();
const {
  createFeeRecord,
  getFees,
  recordPayment,
  updateFee,
  deleteFee,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getFees);
router.post('/', authorize('admin'), createFeeRecord);
router.post('/:id/pay', authorize('admin'), recordPayment);
router.put('/:id', authorize('admin'), updateFee);
router.delete('/:id', authorize('admin'), deleteFee);

module.exports = router;
