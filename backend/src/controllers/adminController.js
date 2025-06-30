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

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('pizzas')
      .populate('user', 'name email address');
    res.json({ orders });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get all users (for admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Get all orders for a specific user
const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .populate('pizzas')
      .populate('user', 'name email address');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
};

module.exports = {
  getSummary,
  getAllOrders,
  getAllUsers,
  getOrdersForUser
};
