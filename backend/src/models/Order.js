const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // TODO: implement Order schema to manage customer orders.
  // order status could be 'pending', 'preparing', 'delivered', or 'cancelled'  
});

module.exports = mongoose.model('Order', orderSchema);
