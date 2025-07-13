# Pizza Shop Challenge

Welcome to the Pizza Shop Challenge! This is a full-stack application where you'll be implementing key features to complete the pizza ordering system.

### 🎯 **Your tasks** (What you need to implement)

#### **Feature 1: Filter, Sort & Pagination**

#### **Feature 2: Order Model Design**

#### **Feature 3: Status update via Webhook Implementation**

---
# 🚀 Getting started
<details>

<summary><i>Open instructions</i></summary>

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

#### **Login Credentials**

**User Account:**

- Email: `user@example.com`
- Password: `test1234`
- Role: Regular user (can place orders, view order history)

**Admin Account:**

- Email: `admin@example.com`
- Password: `test1234`
- Role: Administrator (can manage pizzas, view all orders, access admin dashboard)
</details>

---
# 🎯 **TASK 1: Filter, Sort & Pagination System**
<details>

<summary><i>Open instructions</i></summary>

**Time Estimate**: 30-40 minutes

## 🎬 What You're Building

You'll implement a pizza browsing system that lets users:

- Filter pizzas by diet type (All/Veg/Non-Veg)
- Sort by price (Low to High, High to Low)
- Load more pizzas as they scroll (infinite scroll)

## 📊 Sample Data Context

The database contains ~50 pizzas with these properties:

```javascript
{
  "_id": "...",
  "name": "Margherita",
  "price": 12.99,
  "isVegetarian": true,
  "description": "...",
  "imageUrl": "..."
}
```

## 🔧 Backend Implementation

**File**: `backend/src/controllers/pizzaController.js`

### Query Parameters to Handle:

- `veg`: `true` | `false` (optional - when omitted, shows all pizzas)
- `sortBy`: `'price'` | `'createdAt'` (default: 'createdAt')
- `sortOrder`: `'asc'` | `'desc'` (default: 'desc' for newest first)
- `page`: number (default: 1)
- `limit`: number (default: 10)

### Required Response Format:

```json
{
  "pizzas": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 45,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 10
  }
}
```

### Test Your Backend:

```bash
# Test in terminal:
  npm run feat-1:test
```

## 🎨 Frontend Implementation

**File**: `frontend/src/components/PizzaList.js`

### Filter Controls Required:

- [ ] Three buttons: "All", "Veg", "Non-Veg"
- [ ] Active state styling for selected filter
- [ ] Clear visual feedback when filter changes

### Sort Controls Required:

- [ ] Dropdown with options: "Default" (newest first), "Price: Low to High", "Price: High to Low"
- [ ] Default to "Default" (sorted by createdAt desc)
- [ ] Visual indicator of current sort option

### Infinite Scroll Required:

- [ ] Use Intersection Observer API
- [ ] Load next page when user scrolls near bottom
- [ ] Show loading spinner while fetching
- [ ] Handle "no more results" state
- [ ] Handle API errors gracefully

## ✅ Success Criteria

**You'll know it's working when:**

1. Filter buttons change the displayed pizzas correctly
2. Sort dropdown reorders pizzas by price
3. Scrolling to bottom loads more pizzas automatically
4. Loading states show during API calls
5. "No more pizzas" message appears at the end

## 🧪 Quick Verification

1. Start with "All" filter, "Default" sort (newest pizzas first)
2. Click "Veg" - only vegetarian pizzas display (still newest first)
3. Change sort to "Price: Low to High" - cheapest veg pizzas first
4. Click "Non-Veg" - only non-vegetarian pizzas, cheapest first
5. Change to "Price: High to Low" - most expensive non-veg pizzas first
6. Scroll down - more pizzas load automatically

## ⚠️ Common Gotchas

- Remember to reset to page 1 when filters/sort change
- Handle empty results (no veg pizzas found)
- Prevent duplicate API calls during scroll
- Clear previous results when changing filters
- When no `veg` parameter is sent, show all pizzas (don't filter)
- Default sort should be newest pizzas first (createdAt desc)

## 🔗 API Examples

```bash
# Get all pizzas, newest first (default)
GET /api/pizzas?page=1&limit=10

# Get all pizzas sorted by price (cheapest first)
GET /api/pizzas?sortBy=price&sortOrder=asc&page=1&limit=10

# Get only vegetarian pizzas, most expensive first
GET /api/pizzas?veg=true&sortBy=price&sortOrder=desc&page=1&limit=10

# Get only non-vegetarian pizzas, newest first
GET /api/pizzas?veg=false&page=2&limit=10
```
</details>

---

# 🎯 **TASK 2: Order Model Design**
<details>

<summary><i>Open instructions</i></summary>


![Order Model Demo](https://via.placeholder.com/600x300/059669/ffffff?text=Order+Model+Design+Demo)
_Expected result: Complete order flow with status tracking and data integrity_

**Time Estimate**: 30 minutes

### 📋 Requirements

Design a comprehensive Order schema that demonstrates your database design skills.

### Database Schema Design (`backend/src/models/Order.js`)

This is a **critical design task** that tests your understanding of:

- Database relationships and normalization
- Data integrity and validation
- Business logic modeling
- Performance considerations

### 🏗️ Schema Design Challenge

You need to replace the placeholder schema with a complete Order model that handles:

#### **1. Customer Information**

- User reference (who placed the order)
- Customer contact details
- Delivery address (may differ from user address)

#### **2. Order Items**

- Pizza references with quantities
- Price snapshot (pizzas might change price)
- Individual item calculations

#### **3. Order Status & Tracking**

- Status progression: pending → confirmed → preparing → out_for_delivery → delivered
- Timestamps for each status change
- Estimated delivery time

#### **4. Pricing & Payment**

- Subtotal, tax, delivery fee calculations
- Total amount validation
- Payment status tracking

#### **5. Design Considerations**

- How to handle price changes over time?
- What validations are needed?
- How to structure the items array?
- What indexes for performance?
- How to handle order modifications?

### 📍 File Location

- `backend/src/models/Order.js` - **Replace the placeholder schema**

### 💡 Success Criteria

- Schema handles all business requirements
- Proper validation and constraints
- Efficient queries and indexes
- Clear data relationships
- Handles edge cases gracefully

### 🧪 Testing Your Implementation

Your Order model will be automatically tested across 5 engineering levels:

```bash
# Run the comprehensive test suite
cd backend
npm test order.model.test.js
```

**Test Levels:**

- **Level 1 (50-60%):** Basic schema validation
- **Level 2 (70-80%):** Business logic validation
- **Level 3 (85-90%):** Data integrity & constraints
- **Level 4 (90-95%):** Edge cases & security
- **Level 5 (95%+):** Performance & scalability

See `backend/tests/README.md` for detailed test descriptions and evaluation criteria.



</details>

---

# 🎯 TASK 3: Webhook Implementation
<details>

<summary><i>Open instructions</i></summary>

**Time Estimate**: 20-30 minutes

## 🎬 What You're Building

You'll implement a robust webhook system that lets external delivery services update order status in real-time:

- Receive webhook calls from delivery partners
- Validate order status transitions
- Update order records with proper error handling
- Log status changes for debugging

## 📊 Expected Webhook Payload

The delivery service will send payloads like this:

```json
{
  "orderId": "60d5f484f4b7a5b8c8f8e123",
  "status": "confirmed",
  "estimatedDeliveryTime": "2024-03-15T18:30:00Z",
  "deliveryNotes": "Order confirmed by restaurant",
  "timestamp": "2024-03-15T17:45:00Z"
}
```

## 🔧 Backend Implementation

**File**: `backend/src/controllers/webhookController.js`

### Implementation Requirements:

#### **1. Payload Validation**
- [ ] Validate required fields: `orderId`, `status`, `timestamp`
- [ ] Verify orderId is valid MongoDB ObjectId
- [ ] Return 400 for missing/invalid fields

#### **2. Order Status Management**
- [ ] Find order by ID (return 404 if not found)
- [ ] Validate status transitions using allowed rules
- [ ] Update order status and optional fields
- [ ] Save statusUpdatedAt timestamp

#### **3. Status Transition Rules**
```javascript
const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [], // Final state
  cancelled: [] // Final state
};
```

#### **4. Error Handling**
- [ ] **400 Bad Request**: Missing required fields
- [ ] **404 Not Found**: Order not found
- [ ] **409 Conflict**: Invalid status transition
- [ ] **500 Internal Server Error**: Database errors

#### **5. Response Format**
```json
{
  "message": "Order status updated successfully",
  "orderId": "60d5f484f4b7a5b8c8f8e123",
  "newStatus": "confirmed"
}
```

### Test Your Backend:

```bash
# Test webhook endpoint
npm run feat-1:test
```

## ✅ Success Criteria

**You'll know it's working when:**

1. Valid status updates succeed (pending → confirmed)
2. Invalid transitions are rejected (delivered → pending) 
3. Missing order IDs return 404
4. Missing required fields return 400
5. Database errors are handled gracefully

## 🧪 Quick Verification

1. Start server: `npm run dev`
2. Create an order (use frontend or admin panel)
3. Test valid transition: `pending → confirmed`
4. Test invalid transition: `confirmed → pending` (should fail)
5. Test missing order: use fake order ID (should return 404)
6. Check logs for webhook activity

## ⚠️ Common Gotchas

- Import Order model: `const Order = require('../models/Order')`
- Check transitions before updating status
- Use try/catch for database operations
- Return appropriate HTTP status codes
- Validate required fields before processing
- Don't allow backwards status transitions

## 🔗 API Examples

```bash
# Valid status update (pending → confirmed)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123",
    "status": "confirmed",
    "timestamp": "2024-03-15T17:45:00Z"
  }'

# Invalid transition test (should return 409)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123",
    "status": "pending",
    "timestamp": "2024-03-15T17:45:00Z"
  }'

# Missing fields test (should return 400)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "60d5f484f4b7a5b8c8f8e123"
  }'

# Non-existent order test (should return 404)
curl -X POST http://localhost:5000/api/webhook/delivery-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "000000000000000000000000",
    "status": "confirmed", 
    "timestamp": "2024-03-15T17:45:00Z"
  }'
```
</details>

---

## 📋 Submission Checklist

### What You Need to Complete:

- [ ] **Task 1**: Complete filter/sort/pagination system
- [ ] **Task 2**: Design comprehensive Order schema
- [ ] **Task 3**: Implement webhook functionality

### Quality Standards:

- [ ] All TODO comments addressed
- [ ] Code follows existing patterns and conventions
- [ ] Proper error handling and validation
- [ ] Clean, readable code with good naming
- [ ] Features work as specified

### Testing Your Implementation:

- [ ] Filter and search functionality works
- [ ] Infinite scroll loads more pizzas
- [ ] Order creation and history work
- [ ] Webhook updates order status
- [ ] Admin dashboard displays correctly

---

# 🏆 Success Criteria

### Evaluation Criteria

Your challenge submission will be evaluated on:

- Clean, readable code with consistent formatting
- Proper naming conventions and code organization
- Following existing project patterns and conventions
- Appropriate use of modern JavaScript/React features
- Error handling and validation implementation

- **Feature 1**: Filter/Sort/Pagination functionality
- **Feature 2**: Order Model schema design and testing
- **Feature 3**: Webhook implementation and status updates
- All tests passing (especially Order model tests)
- Requirements met as specified in each task

----

# 🧪 Testing Commands

#### **Run All Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

#### **Test Specific Features**

```bash
# Test Order Model implementation
cd backend
npm test order.model.test.js

# Test with coverage
npm test:coverage

# Watch mode for development
npm test:watch
```
