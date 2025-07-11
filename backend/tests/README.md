# Order Model Testing Suite - Engineering Assessment

## Overview
This test suite evaluates candidates on **Task 2: Order Model Design** by testing their implementation across 5 engineering levels.

## Running Tests

```bash
# Install test dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch

# Run only Order model tests
npm test order.model.test.js
```

## Test Levels & Scoring

### Level 1: Basic Schema Validation (50-60% - Junior Engineer)
**Tests:** Basic required fields, enum validation, default values
- `should require user reference`
- `should require items array` 
- `should validate status enum values`
- `should have default status as pending`

**Passing Criteria:** Basic Mongoose schema with required fields

### Level 2: Business Logic Validation (70-80% - Mid-level Engineer)  
**Tests:** Domain-specific validations, business rules
- `should validate total equals subtotal + tax + delivery fee`
- `should prevent negative quantities`
- `should require valid pizza references in items`
- `should validate phone number format`
- `should enforce minimum order amount`

**Passing Criteria:** Proper business logic implementation with custom validators

### Level 3: Data Integrity & Constraints (85-90% - Advanced Engineer)
**Tests:** Database design skills, data consistency
- `should handle concurrent order creation without duplicate numbers`
- `should preserve price snapshots when pizza price changes`
- `should validate status transition rules`
- `should prevent order modification after certain statuses`

**Passing Criteria:** Advanced schema design with proper constraints and data integrity

### Level 4: Edge Cases & Security (90-95% - Senior Engineer)
**Tests:** Production readiness, security awareness
- `should handle extremely large order quantities`
- `should validate against price manipulation attacks`
- `should handle malformed delivery addresses gracefully`
- `should handle timezone issues in delivery estimation`
- `should validate against XSS in special instructions`

**Passing Criteria:** Robust error handling, input sanitization, security considerations

### Level 5: Performance & Scalability (95%+ - Expert Engineer)
**Tests:** Performance optimization, scalability awareness
- `should efficiently query orders by user`
- `should efficiently query orders by status`
- `should efficiently query orders by date range`
- `should handle large datasets without memory issues`
- `should have appropriate indexes for common queries`

**Passing Criteria:** Optimized queries, proper indexing, memory efficiency

## Expected Implementation Areas

### 1. Schema Structure
```javascript
// Example areas candidates should address:
{
  user: { /* user reference with validation */ },
  orderNumber: { /* unique order identifier */ },
  items: [{ 
    pizza: { /* pizza reference */ },
    name: { /* snapshot of pizza name */ },
    priceAtOrder: { /* price at time of order */ },
    quantity: { /* with validation */ },
    subtotal: { /* calculated field */ }
  }],
  status: { /* enum with transition validation */ },
  deliveryAddress: { /* structured address object */ },
  pricing: { 
    subtotal: Number,
    tax: Number, 
    deliveryFee: Number,
    total: Number 
  },
  timestamps: { /* order lifecycle tracking */ },
  // ... additional fields
}
```

### 2. Key Validation Areas
- **Price Integrity:** Snapshot prices vs current prices
- **Status Transitions:** Valid workflow progression  
- **Input Sanitization:** XSS prevention, data validation
- **Business Rules:** Minimum orders, quantity limits
- **Concurrency:** Thread-safe operations

### 3. Performance Considerations
- **Indexes:** User, status, date queries
- **Memory Management:** Streaming large datasets
- **Query Optimization:** Efficient data retrieval

## Evaluation Rubric

| Level | Score | Criteria |
|-------|-------|----------|
| Junior | 50-60% | Basic schema validation tests pass |
| Mid-level | 70-80% | Business logic tests pass |
| Advanced | 85-90% | Data integrity tests pass |
| Senior | 90-95% | Edge cases and security tests pass |
| Expert | 95%+ | All tests pass including performance |

## Test Failure Analysis

### Common Junior Issues
- Missing required field validations
- No enum constraints on status
- Basic mongoose schema only

### Common Mid-level Issues  
- No business logic validation
- Missing custom validators
- No price calculation validation

### Common Advanced Issues
- No price snapshot handling
- Missing status transition rules
- No concurrency considerations

### Common Senior Issues
- No input sanitization
- Missing edge case handling
- No security validations

### Expert Differentiators
- Performance-optimized queries
- Proper indexing strategy
- Memory-efficient operations
- Scalability considerations

## Usage for Interviewers

1. **Setup:** Candidate implements Order schema in `src/models/Order.js`
2. **Run Tests:** Use `npm test` to evaluate implementation
3. **Review Results:** Check which test levels pass
4. **Score:** Use rubric to determine engineering level
5. **Follow-up:** Discuss failed tests and design decisions