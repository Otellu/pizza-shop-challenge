const request = require('supertest');
const express = require('express');
const pizzaRoutes = require('../../routes/pizzaRoutes');
const Pizza = require('../../models/Pizza');

const app = express();
app.use(express.json());
app.use('/api/pizzas', pizzaRoutes);

describe('Pizza Routes', () => {
  describe('GET /api/pizzas', () => {
    beforeEach(async () => {
      // Create test pizzas
      await Pizza.create([
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
        },
        {
          name: 'Veggie Supreme',
          description: 'Loaded with vegetables',
          price: 16.99,
          veg: true,
          image: 'veggie.jpg'
        }
      ]);
    });

    it('should return all pizzas', async () => {
      const response = await request(app)
        .get('/api/pizzas')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('veg');
    });

    it('should filter vegetarian pizzas when veg=true query param is provided', async () => {
      const response = await request(app)
        .get('/api/pizzas?veg=true')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(pizza => {
        expect(pizza.veg).toBe(true);
      });
    });

    it('should filter non-vegetarian pizzas when veg=false query param is provided', async () => {
      const response = await request(app)
        .get('/api/pizzas?veg=false')
        .expect(200);

      expect(response.body).toHaveLength(1);
      response.body.forEach(pizza => {
        expect(pizza.veg).toBe(false);
      });
    });

    it('should return empty array when no pizzas exist', async () => {
      await Pizza.deleteMany({});

      const response = await request(app)
        .get('/api/pizzas')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/pizzas', () => {
    it('should create a new pizza with valid data', async () => {
      const pizzaData = {
        name: 'Hawaiian',
        description: 'Ham and pineapple pizza',
        price: 14.99,
        veg: false,
        image: 'hawaiian.jpg'
      };

      const response = await request(app)
        .post('/api/pizzas')
        .send(pizzaData)
        .expect(201);

      expect(response.body).toMatchObject(pizzaData);
      expect(response.body._id).toBeTruthy();

      // Verify pizza was created in database
      const pizza = await Pizza.findById(response.body._id);
      expect(pizza).toBeTruthy();
      expect(pizza.name).toBe(pizzaData.name);
    });

    it('should return 500 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/pizzas')
        .send({
          name: 'Incomplete Pizza'
          // Missing description, price, veg, image
        })
        .expect(500);
    });

    it('should create pizza with default values for optional fields', async () => {
      const pizzaData = {
        name: 'Simple Pizza',
        price: 10.99
      };

      const response = await request(app)
        .post('/api/pizzas')
        .send(pizzaData)
        .expect(201);

      expect(response.body.name).toBe(pizzaData.name);
      expect(response.body.price).toBe(pizzaData.price);
    });
  });
});