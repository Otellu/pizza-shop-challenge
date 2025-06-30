const express = require('express');
const admin = require('../middleware/admin.js');
const { getSummary, getIncomingOrders } = require('../controllers/adminController.js');

const router = express.Router();

router.get('/summary', admin, getSummary);
router.get('/orders', admin, getIncomingOrders);

module.exports = router;
