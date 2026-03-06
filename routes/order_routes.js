const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');

// Endpoint untuk mengirim pesanan baru dari User
router.post('/', orderController.checkout);

// Endpoint untuk Admin melihat semua daftar pesanan
router.get('/', orderController.listOrders);

router.delete('/:id', orderController.deleteOrder);

module.exports = router;