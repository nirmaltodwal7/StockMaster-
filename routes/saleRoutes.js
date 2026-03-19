const express = require('express');
const router = express.Router();
const { getSales, recordSale } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSales).post(protect, recordSale);

module.exports = router;
