const Order = require('../models/Order');
const User = require('../models/User');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ 
        status: 1, // pending orders first
        createdAt: -1 // then by most recent
      });
    res.json(orders);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

module.exports = {
  getAllOrders
};
