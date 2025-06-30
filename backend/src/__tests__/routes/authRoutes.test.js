const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('Signup successful');
      expect(response.body.role).toBe('user');

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.address).toBe(userData.address);
      expect(user.role).toBe('user');
      
      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(userData.password, user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('should return 400 if email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        password: 'password123'
      };

      // Create user first
      await User.create({
        ...userData,
        password: await bcrypt.hash(userData.password, 10),
        role: 'user'
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email already in use.');
    });

    it('should return 500 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe'
          // Missing email, address, password
        })
        .expect(500);

      expect(response.body.message).toBe('Signup failed');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeTruthy();
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        role: 'user'
      });
    });

    it('should return 400 with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 with invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 500 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com'
          // Missing password
        })
        .expect(500);

      expect(response.body.message).toBe('Login failed');
    });
  });
});