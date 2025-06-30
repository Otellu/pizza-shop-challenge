const { Order, User } = require('../models');

const getAllOrders = async (req, res) => {
  try {
    // TODO: Get all Order, Sort the orders such that "pending" orders are the top 
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

module.exports = {
  getAllOrders
};
