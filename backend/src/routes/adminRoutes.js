const express = require('express');
const admin = require('../middleware/admin.js');
const { getSummary, getAllOrders, getAllUsers, getOrdersForUser } = require('../controllers/adminController.js');

const router = express.Router();

router.get('/summary', admin, getSummary);
router.get('/orders', admin, getAllOrders);

module.exports = router;
