const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  // Use your test database URL
  const mongoUri = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  // Clean up test data after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});