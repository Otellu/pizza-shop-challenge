const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Pizza, User } = require('../models');

dotenv.config();

const pizzaNames = [
  'Margherita', 'Pepperoni', 'Hawaiian', 'Veggie Delight', 'BBQ Chicken',
  'Spicy Paneer', 'Cheese Burst', 'Mushroom Magic', 'Tandoori Chicken', 'Farmhouse',
  'Mexican Green Wave', 'Double Cheese', 'Chicken Sausage', 'Peppy Paneer', 'Deluxe Veggie',
  'Peri Peri Chicken', 'Corn & Cheese', 'Italian Supreme', 'Classic Tomato', 'Smoky BBQ Veg'
];
const pizzaImages = ['pizza1.jpeg', 'pizza2.jpeg', 'pizza3.jpeg', 'pizza4.jpeg'];

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (let i = 0; i < 20; i++) {
    const name = pizzaNames[i % pizzaNames.length] + ' ' + Math.floor(Math.random() * 1000);
    const image = pizzaImages[Math.floor(Math.random() * pizzaImages.length)];
    await Pizza.findOneAndUpdate(
      { name },
      {
        name,
        ingredients: ['Cheese', 'Tomato', 'Crust'],
        price: Math.floor(Math.random() * 400) + 100,
        available: true,
        image
      },
      { upsert: true, new: true }
    );
  }
  await User.findOneAndUpdate(
    { email: 'admin@admin.com' },
    {
      name: 'Admin',
      email: 'admin@admin.com',
      address: '123 Main St',
      password: '$2a$10$xtEfZ20AeXQL1pmR7RgMxOrRXH0Z78wrj07aloMUHbqbycxGBPonG',
      role: 'admin'
    },
    { upsert: true, new: true }
  );
  await mongoose.disconnect();
  console.log('Pizza migration complete!');
}

migrate().catch(e => { console.error(e); process.exit(1); });
