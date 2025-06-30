const { Order, User } = require('../models');

const getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });
    const totalUsers = await User.countDocuments();
    res.json({ totalOrders, ordersToday, totalUsers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
};

const getIncomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $in: ['pending', 'preparing'] } }).sort({ createdAt: -1 }).limit(20).populate('items.pizza');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

module.exports = {
  getSummary,
  getIncomingOrders
};
