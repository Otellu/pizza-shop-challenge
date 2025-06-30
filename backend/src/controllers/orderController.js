const Order = require('../models/Order.js');

const getOrders = async (req, res) => {
  const orders = await Order.find().populate('pizzas');
  res.json(orders);
};

// Get order history for logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('pizzas');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get details for a specific order (only if owned by user)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('pizzas');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

const createOrder = async (req, res) => {
  const order = new Order({ ...req.body, user: req.user._id });
  await order.save();
  res.status(201).json(order);
};

module.exports = {
  getOrders,
  createOrder,
  getMyOrders,
  getOrderById
};
