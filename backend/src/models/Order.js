const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
  status: { type: String, enum: ['pending', 'preparing', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
