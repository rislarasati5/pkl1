const express = require('express');
const router = express.Router();

const {
  createPayment,
  midtransNotification
} = require('../controllers/payment_controller');

router.post('/create-payment', createPayment);
router.post('/midtrans-notification', midtransNotification);

module.exports = router;