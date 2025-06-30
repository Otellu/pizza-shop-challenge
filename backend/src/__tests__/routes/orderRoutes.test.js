const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const orderRoutes = require('../../routes/orderRoutes');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Pizza = require('../../models/Pizza');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

// Mock JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

describe('Order Routes', () => {
  let testUser;
  let testPizzas;
  let authToken;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      password: await bcrypt.hash('password123', 10),
      role: 'user'
    });

    // Create test pizzas
    testPizzas = await Pizza.create([
      {
        name: 'Margherita',
        description: 'Classic margherita pizza',
        price: 12.99,
        veg: true,
        image: 'margherita.jpg'
      },
      {
        name: 'Pepperoni',
        description: 'Pepperoni pizza',
        price: 15.99,
        veg: false,
        image: 'pepperoni.jpg'
      }
    ]);

    // Generate auth token
    authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create test orders
      await Order.create([
        {
          user: testUser._id,
          pizzas: [testPizzas[0]._id],
          address: '123 Main St',
          status: 'pending'
        },
        {
          user: testUser._id,
          pizzas: [testPizzas[1]._id],
          address: '456 Oak St',
          status: 'delivered'
        }
      ]);
    });

    it('should return all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('pizzas');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('address');
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid auth token', async () => {
      const orderData = {
        pizzas: [testPizzas[0]._id, testPizzas[1]._id],
        address: '789 Pine St',
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.user).toBe(testUser._id.toString());
      expect(response.body.pizzas).toEqual([
        testPizzas[0]._id.toString(),
        testPizzas[1]._id.toString()
      ]);
      expect(response.body.address).toBe(orderData.address);
      expect(response.body.status).toBe(orderData.status);

      // Verify order was created in database
      const order = await Order.findById(response.body._id);
      expect(order).toBeTruthy();
    });

    it('should return 401 without auth token', async () => {
      const orderData = {
        pizzas: [testPizzas[0]._id],
        address: '789 Pine St',
        status: 'pending'
      };

      await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);
    });

    it('should return 401 with invalid auth token', async () => {
      const orderData = {
        pizzas: [testPizzas[0]._id],
        address: '789 Pine St',
        status: 'pending'
      };

      await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer invalid-token')
        .send(orderData)
        .expect(401);
    });
  });

  describe('GET /api/orders/mine', () => {
    let otherUser;
    
    beforeEach(async () => {
      // Create another user
      otherUser = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Oak St',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      });

      // Create orders for both users
      await Order.create([
        {
          user: testUser._id,
          pizzas: [testPizzas[0]._id],
          address: '123 Main St',
          status: 'pending'
        },
        {
          user: testUser._id,
          pizzas: [testPizzas[1]._id],
          address: '123 Main St',
          status: 'delivered'
        },
        {
          user: otherUser._id,
          pizzas: [testPizzas[0]._id],
          address: '456 Oak St',
          status: 'pending'
        }
      ]);
    });

    it('should return only current user orders with valid auth token', async () => {
      const response = await request(app)
        .get('/api/orders/mine')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(order => {
        expect(order.user).toBe(testUser._id.toString());
      });
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/orders/mine')
        .expect(401);
    });

    it('should return orders sorted by creation date (newest first)', async () => {
      const response = await request(app)
        .get('/api/orders/mine')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      const dates = response.body.map(order => new Date(order.createdAt));
      expect(dates[0] >= dates[1]).toBe(true);
    });
  });

  describe('GET /api/orders/:orderId', () => {
    let testOrder;
    let otherUserOrder;
    let otherUser;

    beforeEach(async () => {
      // Create another user
      otherUser = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Oak St',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      });

      // Create orders
      testOrder = await Order.create({
        user: testUser._id,
        pizzas: [testPizzas[0]._id],
        address: '123 Main St',
        status: 'pending'
      });

      otherUserOrder = await Order.create({
        user: otherUser._id,
        pizzas: [testPizzas[1]._id],
        address: '456 Oak St',
        status: 'pending'
      });
    });

    it('should return order details for owned order', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(testOrder._id.toString());
      expect(response.body.user).toBe(testUser._id.toString());
      expect(response.body.pizzas).toHaveLength(1);
    });

    it('should return 403 for order owned by another user', async () => {
      const response = await request(app)
        .get(`/api/orders/${otherUserOrder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.message).toBe('Not authorized to view this order');
    });

    it('should return 404 for non-existent order', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/orders/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Order not found');
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .expect(401);
    });
  });
});