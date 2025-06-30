const express = require('express');
const { getOrders, createOrder } = require('../controllers/orderController.js');
const validateToken = require('../middleware/auth.js');

const router = express.Router();

router.get('/', getOrders);
router.post('/', validateToken, createOrder);

module.exports = router;
