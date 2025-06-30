# Route Tests Documentation

This directory contains comprehensive Jest tests for all API routes in the pizza shop backend application.

## Test Structure

### Test Files
- `authRoutes.test.js` - Authentication routes (/api/auth)
- `pizzaRoutes.test.js` - Pizza management routes (/api/pizzas)
- `orderRoutes.test.js` - Order management routes (/api/orders)
- `adminRoutes.test.js` - Admin dashboard routes (/api/admin)
- `webhookRoutes.test.js` - Webhook routes (/api/webhook)

### Test Setup
- **Database**: Uses MongoDB Memory Server for isolated testing
- **Authentication**: JWT tokens generated for protected route testing
- **Data**: Fresh test data created for each test case
- **Cleanup**: Database cleared between tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- authRoutes.test.js
```

## Test Coverage

### Authentication Routes
- ✅ User signup with valid data
- ✅ Email uniqueness validation
- ✅ User login with valid credentials
- ✅ Invalid credential handling
- ✅ Missing field validation

### Pizza Routes
- ✅ Fetch all pizzas
- ✅ Filter pizzas by vegetarian status
- ✅ Create new pizza
- ✅ Validation error handling

### Order Routes
- ✅ Fetch all orders (public)
- ✅ Create order (authenticated)
- ✅ Get user's orders (authenticated)
- ✅ Get specific order (owner only)
- ✅ Authorization validation
- ✅ Order ownership verification

### Admin Routes  
- ✅ Fetch all orders (admin only)
- ✅ Admin role verification
- ✅ Data population (users, pizzas)
- ✅ Sort order validation
- ✅ Error handling

### Webhook Routes
- ✅ Accept delivery status updates
- ✅ Handle various payload formats
- ✅ Malformed data handling
- ✅ Large payload support

## Key Testing Patterns

### Authentication Testing
```javascript
// Generate test JWT token
const authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);

// Use in requests
.set('Authorization', `Bearer ${authToken}`)
```

### Database Testing
```javascript
// Fresh data for each test
beforeEach(async () => {
  await User.create(testUserData);
});

// Clean slate after each test (handled in setup.js)
afterEach(async () => {
  // Database cleared automatically
});
```

### Error Handling
```javascript
// Test various error scenarios
it('should return 400 with invalid data', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send(invalidData)
    .expect(400);
    
  expect(response.body.message).toBeDefined();
});
```

## Notes

- Tests are designed to work with the current TODO implementation
- Some webhook tests accommodate the incomplete webhook controller
- All protected routes include authentication and authorization testing
- Database relationships are properly tested with population
- Error scenarios are comprehensively covered