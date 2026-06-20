const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getAnalytics, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/transactions
// The "protect" middleware ensures only logged-in users can hit this route
router.post('/', protect, addTransaction);

router.get('/', protect,  getTransactions);

router.get('/analytics', protect, getAnalytics);

router.put('/:id', protect, updateTransaction);

router.delete('/:id', protect, deleteTransaction);

module.exports = router;