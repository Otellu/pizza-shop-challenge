const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminRoutes = require('../../routes/adminRoutes');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Pizza = require('../../models/Pizza');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

// Mock JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

describe('Admin Routes', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;
  let testPizzas;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      address: '123 Admin St',
      password: await bcrypt.hash('password123', 10),
      role: 'admin'
    });

    // Create regular user
    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      address: '456 User St',
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

    // Generate auth tokens
    adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET);
    userToken = jwt.sign({ userId: regularUser._id }, process.env.JWT_SECRET);
  });

  describe('GET /api/admin/orders', () => {
    beforeEach(async () => {
      // Create test orders with different statuses
      await Order.create([
        {
          user: regularUser._id,
          pizzas: [testPizzas[0]._id],
          address: '123 Main St',
          status: 'pending',
          createdAt: new Date('2023-01-01')
        },
        {
          user: regularUser._id,
          pizzas: [testPizzas[1]._id],
          address: '456 Oak St',
          status: 'delivered',
          createdAt: new Date('2023-01-02')
        },
        {
          user: regularUser._id,
          pizzas: [testPizzas[0]._id, testPizzas[1]._id],
          address: '789 Pine St',
          status: 'pending',
          createdAt: new Date('2023-01-03')
        }
      ]);
    });

    it('should return all orders for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.orders).toHaveLength(3);
      expect(response.body.orders[0]).toHaveProperty('user');
      expect(response.body.orders[0]).toHaveProperty('pizzas');
      expect(response.body.orders[0]).toHaveProperty('status');
      expect(response.body.orders[0]).toHaveProperty('address');
    });

    it('should populate user and pizza data', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const order = response.body.orders[0];
      expect(order.user).toHaveProperty('name');
      expect(order.user).toHaveProperty('email');
      expect(order.user).toHaveProperty('address');
      expect(order.user).not.toHaveProperty('password');
      expect(order.pizzas[0]).toHaveProperty('name');
      expect(order.pizzas[0]).toHaveProperty('price');
    });

    it('should sort orders by creation date (newest first)', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const orders = response.body.orders;
      const dates = orders.map(order => new Date(order.createdAt));
      
      // Check that orders are sorted by creation date (newest first)
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i] >= dates[i + 1]).toBe(true);
      }
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/admin/orders')
        .expect(401);
    });

    it('should return 401 with invalid auth token', async () => {
      await request(app)
        .get('/api/admin/orders')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 403 for non-admin user', async () => {
      await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return empty array when no orders exist', async () => {
      await Order.deleteMany({});

      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.orders).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      // Mock Order.find to throw an error
      const originalFind = Order.find;
      Order.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.message).toBe('Failed to fetch orders');
      expect(response.body.error).toBe('Database error');

      // Restore original method
      Order.find = originalFind;
    });
  });
});