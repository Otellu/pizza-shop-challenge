const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // TODO: CANDIDATE TASK - Design complete Order schema
  // 
  // This is a critical design task that tests your database design skills.
  // You need to design a comprehensive order schema that handles:
  // 
  // REQUIRED FIELDS TO CONSIDER:
  // 1. Customer Information:
  //    - User reference (who placed the order)
  //    - Customer name, email, phone
  //    - Delivery address (could be different from user's address)
  //
  // 2. Order Items:
  //    - Which pizzas were ordered
  //    - Quantities for each pizza
  //    - Price at time of order (pizzas might change price)
  //    - Individual item totals
  //
  // 3. Order Status & Tracking:
  //    - Current status: 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  //    - Order timestamps (created, confirmed, delivered, etc.)
  //    - Estimated delivery time
  //
  // 4. Pricing & Payment:
  //    - Subtotal (before taxes/fees)
  //    - Tax amount
  //    - Delivery fee
  //    - Total amount
  //    - Payment status and method
  //
  // 5. Additional Information:
  //    - Special instructions
  //    - Delivery notes
  //    - Contact information
  //
  // DESIGN CONSIDERATIONS:
  // - How will you handle pizza price changes over time?
  // - How will you structure the items array?
  // - What validations are needed?
  // - How will you handle order modifications?
  // - What indexes might be needed for performance?
  // - How will you handle order history queries?
  //
  // EXAMPLE STRUCTURE (you can modify this):
  // {
  //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //   orderNumber: { type: String, unique: true, required: true },
  //   items: [
  //     {
  //       pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
  //       name: String,
  //       price: Number,
  //       quantity: Number,
  //       subtotal: Number
  //     }
  //   ],
  //   status: { 
  //     type: String, 
  //     enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
  //     default: 'pending'
  //   },
  //   deliveryAddress: {
  //     street: String,
  //     city: String,
  //     zipCode: String,
  //     phone: String
  //   },
  //   pricing: {
  //     subtotal: Number,
  //     tax: Number,
  //     deliveryFee: Number,
  //     total: Number
  //   },
  //   timestamps: {
  //     ordered: { type: Date, default: Date.now },
  //     confirmed: Date,
  //     delivered: Date
  //   },
  //   specialInstructions: String,
  //   paymentStatus: {
  //     type: String,
  //     enum: ['pending', 'completed', 'failed'],
  //     default: 'pending'
  //   }
  // }
  //
  // TODO: Implement your schema design below
  // Remember to add proper validation, indexes, and timestamps
  
  // FOR NOW: Basic placeholder schema to enable functionality
  // CANDIDATE MUST REPLACE THIS WITH PROPER SCHEMA DESIGN
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.Mixed }], // Simplified for now
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Order', orderSchema);
