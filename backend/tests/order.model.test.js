const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const Pizza = require('../src/models/Pizza');

describe('Order Model - Engineering Assessment', () => {
  let testUser, testPizza1, testPizza2;

  beforeEach(async () => {
    // Setup test data
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      password: 'password123'
    });

    testPizza1 = await Pizza.create({
      name: 'Margherita',
      ingredients: ['tomato', 'mozzarella', 'basil'],
      price: 12.99,
      available: true,
      veg: true
    });

    testPizza2 = await Pizza.create({
      name: 'Pepperoni',
      ingredients: ['tomato', 'mozzarella', 'pepperoni'],
      price: 15.99,
      available: true,
      veg: false
    });
  });

  // =================================================================
  // LEVEL 1: BASIC SCHEMA VALIDATION (Junior Engineer - 50-60%)
  // =================================================================
  describe('Level 1: Basic Schema Validation', () => {
    test('should require user reference', async () => {
      const orderData = {
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      const error = order.validateSync();
      
      expect(error).toBeTruthy();
      expect(error.errors.user).toBeTruthy();
    });

    test('should require items array', async () => {
      const orderData = {
        user: testUser._id,
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should validate status enum values', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        status: 'invalid_status',
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      const error = order.validateSync();
      
      expect(error).toBeTruthy();
      expect(error.errors.status).toBeTruthy();
    });

    test('should have default status as pending', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      expect(order.status).toBe('pending');
    });
  });

  // =================================================================
  // LEVEL 2: BUSINESS LOGIC VALIDATION (Mid-level Engineer - 70-80%)
  // =================================================================
  describe('Level 2: Business Logic Validation', () => {
    test('should validate total equals subtotal + tax + delivery fee', async () => {
      const orderData = {
        user: testUser._id,
        items: [
          { pizza: testPizza1._id, quantity: 2, priceAtOrder: 12.99 }
        ],
        pricing: {
          subtotal: 25.98,
          tax: 2.60,
          deliveryFee: 3.99,
          total: 32.57 // Correct total
        },
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      await expect(order.save()).resolves.toBeTruthy();

      // Test incorrect total
      orderData.pricing.total = 30.00; // Wrong total
      const invalidOrder = new Order(orderData);
      await expect(invalidOrder.save()).rejects.toThrow();
    });

    test('should prevent negative quantities', async () => {
      const orderData = {
        user: testUser._id,
        items: [
          { pizza: testPizza1._id, quantity: -1, priceAtOrder: 12.99 }
        ],
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require valid pizza references in items', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const orderData = {
        user: testUser._id,
        items: [
          { pizza: fakeId, quantity: 1, priceAtOrder: 12.99 }
        ],
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      await order.save(); // Should save but...
      
      // When populated, should handle missing pizza gracefully
      const populatedOrder = await Order.findById(order._id).populate('items.pizza');
      expect(populatedOrder.items[0].pizza).toBeNull();
    });

    test('should validate phone number format in delivery address', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          zipCode: '12345',
          phone: 'invalid-phone'
        },
        totalAmount: 12.99
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should enforce minimum order amount', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        totalAmount: 1.00, // Below minimum
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });
  });

  // =================================================================
  // LEVEL 3: DATA INTEGRITY & CONSTRAINTS (Advanced Engineer - 85-90%)
  // =================================================================
  describe('Level 3: Data Integrity & Constraints', () => {
    test('should handle concurrent order creation without duplicate numbers', async () => {
      const createOrder = () => Order.create({
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      });

      // Create multiple orders concurrently
      const promises = Array.from({ length: 5 }, createOrder);
      const orders = await Promise.all(promises);

      // All orders should have unique order numbers
      const orderNumbers = orders.map(o => o.orderNumber);
      const uniqueNumbers = new Set(orderNumbers);
      expect(uniqueNumbers.size).toBe(orderNumbers.length);
    });

    test('should preserve price snapshots when pizza price changes', async () => {
      const originalPrice = testPizza1.price;
      
      const order = await Order.create({
        user: testUser._id,
        items: [{ 
          pizza: testPizza1._id, 
          quantity: 1, 
          priceAtOrder: originalPrice,
          name: testPizza1.name
        }],
        totalAmount: originalPrice,
        deliveryAddress: '123 Test St'
      });

      // Change pizza price
      testPizza1.price = 20.00;
      await testPizza1.save();

      // Order should still have original price
      const savedOrder = await Order.findById(order._id);
      expect(savedOrder.items[0].priceAtOrder).toBe(originalPrice);
    });

    test('should validate status transition rules', async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        status: 'pending',
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      });

      // Valid transition: pending -> confirmed
      order.status = 'confirmed';
      await expect(order.save()).resolves.toBeTruthy();

      // Invalid transition: confirmed -> pending
      order.status = 'pending';
      await expect(order.save()).rejects.toThrow();

      // Invalid transition: confirmed -> delivered (skipping preparing)
      order.status = 'delivered';
      await expect(order.save()).rejects.toThrow();
    });

    test('should prevent order modification after certain statuses', async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        status: 'delivered',
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      });

      // Should prevent modification of delivered orders
      order.items.push({ pizza: testPizza2._id, quantity: 1 });
      await expect(order.save()).rejects.toThrow();
    });
  });

  // =================================================================
  // LEVEL 4: EDGE CASES & SECURITY (Senior Engineer - 90-95%)
  // =================================================================
  describe('Level 4: Edge Cases & Security', () => {
    test('should handle extremely large order quantities', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ 
          pizza: testPizza1._id, 
          quantity: 999999, 
          priceAtOrder: testPizza1.price 
        }],
        totalAmount: 999999 * testPizza1.price,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      // Should either handle gracefully or reject with proper error
      await expect(order.save()).rejects.toThrow(/quantity.*too large/i);
    });

    test('should validate against price manipulation attacks', async () => {
      const orderData = {
        user: testUser._id,
        items: [{ 
          pizza: testPizza1._id, 
          quantity: 1, 
          priceAtOrder: 0.01 // Manipulated price
        }],
        totalAmount: 0.01,
        deliveryAddress: '123 Test St'
      };

      const order = new Order(orderData);
      // Should validate price against current pizza price within tolerance
      await expect(order.save()).rejects.toThrow(/price.*invalid/i);
    });

    test('should handle malformed delivery addresses gracefully', async () => {
      const malformedAddresses = [
        '', // Empty
        'a'.repeat(1000), // Too long
        '<script>alert("xss")</script>', // XSS attempt
        null, // Null
        { malformed: 'object' } // Wrong type
      ];

      for (const address of malformedAddresses) {
        const orderData = {
          user: testUser._id,
          items: [{ pizza: testPizza1._id, quantity: 1 }],
          deliveryAddress: address,
          totalAmount: 12.99
        };

        const order = new Order(orderData);
        await expect(order.save()).rejects.toThrow();
      }
    });

    test('should handle timezone issues in delivery estimation', async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{ pizza: testPizza1._id, quantity: 1 }],
        estimatedDeliveryTime: new Date('2024-01-01T12:00:00Z'),
        totalAmount: 12.99,
        deliveryAddress: '123 Test St'
      });

      const savedOrder = await Order.findById(order._id);
      expect(savedOrder.estimatedDeliveryTime).toBeInstanceOf(Date);
      expect(savedOrder.estimatedDeliveryTime.getTime()).toBe(
        new Date('2024-01-01T12:00:00Z').getTime()
      );
    });

    test('should validate against XSS in special instructions', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
        '${alert("xss")}'
      ];

      for (const payload of xssPayloads) {
        const orderData = {
          user: testUser._id,
          items: [{ pizza: testPizza1._id, quantity: 1 }],
          specialInstructions: payload,
          totalAmount: 12.99,
          deliveryAddress: '123 Test St'
        };

        const order = new Order(orderData);
        await order.save();
        
        // Instructions should be sanitized
        const savedOrder = await Order.findById(order._id);
        expect(savedOrder.specialInstructions).not.toContain('<script>');
        expect(savedOrder.specialInstructions).not.toContain('javascript:');
      }
    });
  });

  // =================================================================
  // LEVEL 5: PERFORMANCE & SCALABILITY (Expert Engineer - 95%+)
  // =================================================================
  describe('Level 5: Performance & Scalability', () => {
    beforeEach(async () => {
      // Create test data for performance tests
      const users = await User.create([
        { name: 'User 1', email: 'user1@test.com', address: '123 St', password: 'pass' },
        { name: 'User 2', email: 'user2@test.com', address: '456 St', password: 'pass' }
      ]);

      const orders = [];
      for (let i = 0; i < 100; i++) {
        orders.push({
          user: users[i % 2]._id,
          items: [{ pizza: testPizza1._id, quantity: 1 }],
          status: ['pending', 'confirmed', 'delivered'][i % 3],
          totalAmount: 12.99,
          deliveryAddress: '123 Test St',
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // Spread over days
        });
      }
      await Order.create(orders);
    });

    test('should efficiently query orders by user', async () => {
      const startTime = Date.now();
      
      const userOrders = await Order.find({ user: testUser._id });
      
      const queryTime = Date.now() - startTime;
      expect(queryTime).toBeLessThan(100); // Should be fast with proper indexing
      expect(userOrders).toHaveLength(0); // testUser has no orders in this dataset
    });

    test('should efficiently query orders by status', async () => {
      const startTime = Date.now();
      
      const pendingOrders = await Order.find({ status: 'pending' });
      
      const queryTime = Date.now() - startTime;
      expect(queryTime).toBeLessThan(100);
      expect(pendingOrders.length).toBeGreaterThan(0);
    });

    test('should efficiently query orders by date range', async () => {
      const startTime = Date.now();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const recentOrders = await Order.find({
        createdAt: { $gte: sevenDaysAgo }
      });
      
      const queryTime = Date.now() - startTime;
      expect(queryTime).toBeLessThan(100);
      expect(recentOrders.length).toBeGreaterThan(0);
    });

    test('should handle large datasets without memory issues', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Stream through all orders instead of loading all at once
      const cursor = Order.find({}).cursor();
      let count = 0;
      
      for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        count++;
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(count).toBeGreaterThan(0);
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
    });

    test('should have appropriate indexes for common queries', async () => {
      const indexes = await Order.collection.getIndexes();
      const indexNames = Object.keys(indexes);
      
      // Should have indexes on commonly queried fields
      expect(indexNames.some(name => name.includes('user'))).toBeTruthy();
      expect(indexNames.some(name => name.includes('status'))).toBeTruthy();
      expect(indexNames.some(name => name.includes('createdAt'))).toBeTruthy();
    });
  });
});