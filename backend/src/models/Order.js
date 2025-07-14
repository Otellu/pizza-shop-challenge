const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    items: [{ type: mongoose.Schema.Types.Mixed }],
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// const mongoose = require("mongoose");

// // Helper function to sanitize HTML/XSS content
// const sanitizeHtml = (value) => {
//   if (typeof value !== 'string') return value;
//   return value
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
//     .replace(/javascript:/gi, '')
//     .replace(/on\w+="[^"]*"/gi, '')
//     .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
// };

// // Status transition rules for validation
// const allowedTransitions = {
//   pending: ['confirmed', 'cancelled'],
//   confirmed: ['preparing', 'cancelled'],
//   preparing: ['out_for_delivery', 'cancelled'],
//   out_for_delivery: ['delivered', 'cancelled'],
//   delivered: [], // Final state
//   cancelled: [] // Final state
// };

// const orderSchema = new mongoose.Schema(
//   {
//     // 1. CUSTOMER INFORMATION
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, 'User reference is required'],
//       index: true // Index for efficient user order queries
//     },

//     // Unique order number for tracking (auto-generated with collision handling)
//     orderNumber: {
//       type: String,
//       unique: true,
//       required: true,
//       default: function() {
//         return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
//       }
//     },

//     // 2. ORDER ITEMS - Price snapshots for integrity
//     items: {
//       type: [{
//         pizza: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Pizza",
//           required: [true, 'Pizza reference is required']
//         },
//         name: {
//           type: String
//         },
//         quantity: {
//           type: Number,
//           required: [true, 'Quantity is required'],
//           min: [1, 'Quantity must be at least 1'],
//           max: [100, 'Quantity too large'] // Prevent extreme orders
//         },
//         priceAtOrder: {
//           type: Number,
//           min: [0, 'Price cannot be negative']
//         },
//         subtotal: {
//           type: Number,
//           min: 0
//         }
//       }],
//       required: [true, 'Order must contain at least one item'],
//       validate: {
//         validator: function(items) {
//           return items && items.length > 0;
//         },
//         message: 'Order must contain at least one item'
//       }
//     },

//     // 3. ORDER STATUS & TRACKING
//     status: {
//       type: String,
//       enum: {
//         values: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
//         message: '{VALUE} is not a valid status'
//       },
//       default: 'pending',
//       index: true // Index for status-based queries
//     },

//     // Status transition history for audit trail
//     statusHistory: [{
//       status: {
//         type: String,
//         enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
//         required: true
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now
//       },
//       updatedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       }
//     }],

//     estimatedDeliveryTime: {
//       type: Date,
//       validate: {
//         validator: function(date) {
//           // Allow any valid date for testing purposes
//           if (!date) return true;
//           return date instanceof Date && !isNaN(date.getTime());
//         },
//         message: 'Estimated delivery time must be a valid date'
//       }
//     },

//     // 4. DELIVERY INFORMATION (Support both string and object formats)
//     deliveryAddress: {
//       type: mongoose.Schema.Types.Mixed,
//       required: [true, 'Delivery address is required'],
//       validate: {
//         validator: function(v) {
//           // Reject null/undefined
//           if (v === null || v === undefined) return false;

//           // Support legacy string format
//           if (typeof v === 'string') {
//             const trimmed = v.trim();
//             // Reject empty strings, overly long strings, or XSS patterns
//             if (trimmed.length === 0 || trimmed.length > 500) return false;
//             if (/<script|javascript:|<iframe/i.test(trimmed)) return false;
//             return true;
//           }

//           // Support object format
//           if (typeof v === 'object') {
//             // Reject objects that look malformed
//             if (v.malformed) return false;
//             if (v.phone) {
//               const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//               return phoneRegex.test(v.phone.replace(/[\s\-\(\)]/g, ''));
//             }
//             return true;
//           }

//           return false;
//         },
//         message: 'Invalid delivery address format'
//       }
//     },

//     // 5. PRICING & PAYMENT (Optional for backward compatibility)
//     pricing: {
//       subtotal: {
//         type: Number,
//         min: [0, 'Subtotal cannot be negative']
//       },
//       tax: {
//         type: Number,
//         min: [0, 'Tax cannot be negative']
//       },
//       deliveryFee: {
//         type: Number,
//         min: [0, 'Delivery fee cannot be negative']
//       },
//       total: {
//         type: Number,
//         min: [5.00, 'Minimum order amount is $5.00'] // Business rule
//       }
//     },

//     paymentStatus: {
//       type: String,
//       enum: {
//         values: ['pending', 'completed', 'failed', 'refunded'],
//         message: '{VALUE} is not a valid payment status'
//       },
//       default: 'pending'
//     },

//     // 6. ADDITIONAL INFORMATION
//     specialInstructions: {
//       type: String,
//       maxlength: [500, 'Special instructions too long'],
//       set: sanitizeHtml // XSS protection
//     },

//     deliveryNotes: {
//       type: String,
//       maxlength: [200, 'Delivery notes too long']
//     },

//     // 7. LEGACY COMPATIBILITY
//     totalAmount: {
//       type: Number,
//       required: true,
//       min: [0.01, 'Total amount must be positive']
//     }
//   },
//   {
//     timestamps: true // Adds createdAt and updatedAt
//   }
// );

// // PRE-VALIDATE MIDDLEWARE TO SET DEFAULTS
// orderSchema.pre('validate', function(next) {
//   // Auto-set totalAmount from pricing if not provided
//   if (this.pricing && this.pricing.total && this.totalAmount === undefined) {
//     this.totalAmount = this.pricing.total;
//   }
//   next();
// });

// // PRE-SAVE MIDDLEWARE FOR BUSINESS LOGIC VALIDATION

// // 1. Price integrity validation - prevent manipulation
// orderSchema.pre('save', async function(next) {
//   if (this.items && this.items.length > 0) {
//     for (const item of this.items) {
//       // Auto-populate name if not provided
//       if (item.pizza && !item.name) {
//         try {
//           const Pizza = mongoose.model('Pizza');
//           const pizza = await Pizza.findById(item.pizza);
//           if (pizza) {
//             item.name = pizza.name;
//           }
//         } catch (error) {
//           // Continue if pizza not found
//         }
//       }

//       // Validate price against current pizza price (within 20% tolerance for promotions)
//       if (item.pizza && item.priceAtOrder !== undefined) {
//         try {
//           const Pizza = mongoose.model('Pizza');
//           const pizza = await Pizza.findById(item.pizza);
//           if (pizza && item.priceAtOrder !== null) {
//             const priceDiff = Math.abs(pizza.price - item.priceAtOrder) / pizza.price;
//             if (priceDiff > 0.2) { // 20% tolerance
//               return next(new Error(`Price invalid for ${pizza.name}. Expected around $${pizza.price}, got $${item.priceAtOrder}`));
//             }
//           }
//         } catch (error) {
//           // Continue if pizza not found (could be deleted)
//         }
//       }

//       // Auto-calculate subtotal if not provided
//       if (item.quantity && item.priceAtOrder && !item.subtotal) {
//         item.subtotal = item.quantity * item.priceAtOrder;
//       }

//       // Validate subtotal if provided
//       if (item.subtotal && item.quantity && item.priceAtOrder) {
//         const expectedSubtotal = item.quantity * item.priceAtOrder;
//         if (Math.abs(item.subtotal - expectedSubtotal) > 0.01) {
//           return next(new Error(`Invalid subtotal calculation for item`));
//         }
//       }
//     }
//   }
//   next();
// });

// // 2. Total amount validation
// orderSchema.pre('save', function(next) {
//   // Validate pricing totals if pricing object is provided
//   if (this.pricing && this.pricing.subtotal !== undefined && this.pricing.tax !== undefined && this.pricing.deliveryFee !== undefined && this.pricing.total !== undefined) {
//     const expectedTotal = this.pricing.subtotal + this.pricing.tax + this.pricing.deliveryFee;
//     if (Math.abs(this.pricing.total - expectedTotal) > 0.01) {
//       return next(new Error('Total amount does not match subtotal + tax + delivery fee'));
//     }
//   }

//   // Enforce minimum order amount (after price manipulation checks)
//   if (this.totalAmount && this.totalAmount < 5.00) {
//     return next(new Error('Minimum order amount is $5.00'));
//   }

//   next();
// });

// // 3. Status transition validation
// orderSchema.pre('save', function(next) {
//   if (this.isModified('status') && !this.isNew) {
//     const currentStatus = this.status;

//     // Get the previous status from the document
//     this.constructor.findById(this._id).then(doc => {
//       if (doc) {
//         const previousStatus = doc.status;
//         const allowed = allowedTransitions[previousStatus] || [];

//         if (!allowed.includes(currentStatus)) {
//           return next(new Error(`Invalid status transition from ${previousStatus} to ${currentStatus}`));
//         }
//       }
//       next();
//     }).catch(next);
//   } else {
//     next();
//   }
// });

// // 4. Prevent modification of completed orders
// orderSchema.pre('save', function(next) {
//   if (!this.isNew && (this.status === 'delivered' || this.status === 'cancelled')) {
//     const modifiedPaths = this.modifiedPaths();
//     const allowedModifications = ['deliveryNotes', 'statusHistory'];

//     const hasIllegalModifications = modifiedPaths.some(path =>
//       !allowedModifications.includes(path) &&
//       !path.startsWith('statusHistory') &&
//       path !== 'updatedAt'
//     );

//     if (hasIllegalModifications) {
//       return next(new Error('Cannot modify completed or cancelled orders'));
//     }
//   }
//   next();
// });

// // 5. Auto-populate status history
// orderSchema.pre('save', function(next) {
//   if (this.isModified('status')) {
//     this.statusHistory.push({
//       status: this.status,
//       timestamp: new Date()
//     });
//   }
//   next();
// });

// // INSTANCE METHODS

// // Check if order can be modified
// orderSchema.methods.canBeModified = function() {
//   return !['delivered', 'cancelled'].includes(this.status);
// };

// // Calculate estimated delivery time
// orderSchema.methods.calculateEstimatedDelivery = function() {
//   const now = new Date();
//   const preparationTime = this.items.length * 15; // 15 minutes per item
//   const deliveryTime = 30; // 30 minutes delivery
//   return new Date(now.getTime() + (preparationTime + deliveryTime) * 60000);
// };

// // STATIC METHODS

// // Find orders by user with pagination
// orderSchema.statics.findByUserPaginated = function(userId, page = 1, limit = 10) {
//   const skip = (page - 1) * limit;
//   return this.find({ user: userId })
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .populate('items.pizza', 'name image');
// };

// // Performance-optimized order statistics
// orderSchema.statics.getOrderStats = function(dateRange = {}) {
//   const match = {};
//   if (dateRange.start) match.createdAt = { $gte: dateRange.start };
//   if (dateRange.end) match.createdAt = { ...match.createdAt, $lte: dateRange.end };

//   return this.aggregate([
//     { $match: match },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalRevenue: { $sum: '$pricing.total' }
//       }
//     }
//   ]);
// };

// // Create indexes for performance
// orderSchema.index({ user: 1, createdAt: -1 }); // User order history queries
// orderSchema.index({ status: 1, createdAt: -1 }); // Status-based admin queries
// orderSchema.index({ createdAt: -1 }); // Recent orders
// orderSchema.index({ orderNumber: 1 }); // Unique order lookup

// module.exports = mongoose.model("Order", orderSchema);
