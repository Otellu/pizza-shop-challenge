const Order = require("../models/Order.js");
const { simulateDeliveryUpdate } = require("../services/delivery.service.js");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get order history for logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: 1,
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get details for a specific order (only if owned by user)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount } = req.body;

    if (!items || !deliveryAddress || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      deliveryAddress,
      totalAmount,
      status: "pending",
    });

    await order.save();

    // Simulate delivery updates
    simulateDeliveryUpdate(order._id);

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  getMyOrders,
  getOrderById,
};
