const Order = require('../models/Order.js');

const getOrders = async (req, res) => {
  const orders = await Order.find().populate('pizzas');
  res.json(orders);
};

const createOrder = async (req, res) => {
  const order = new Order({ ...req.body, user: req.user._id });
  await order.save();
  res.status(201).json(order);
};

module.exports = {
  getOrders,
  createOrder
};
