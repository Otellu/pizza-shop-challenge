# Pizza Shop Challenge

Welcome to the Pizza Shop Challenge! This is a full-stack application where you'll be implementing key features to complete the pizza ordering system.

## 🎯 **YOUR TASKS** (What you need to implement)

### **Feature 1: Filter, Sort & Pagination System**

### **Feature 2: Order Model Design**

### **Feature 3: Status update via Webhook Implementation**

---

## 🎯 **TASK 1: Filter, Sort & Pagination System**

### 📋 Requirements

Implement a complete filtering, sorting, and infinite scroll pagination system for pizzas.

### Backend Implementation (`backend/src/controllers/pizzaController.js`)

- [ ] **Query Parameter Handling**:

  - `filter`: 'veg', 'non-veg'
  - `sortOrder`: 'asc', 'desc'
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

- [ ] **Response Format**:
  ```json
  {
    "pizzas": [...],
    "totalCount": 45,
    "currentPage": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
  ```

### Frontend Implementation (`frontend/src/components/PizzaList.js`)

- [ ] **Filter Controls**:

  - All, Veg, Non-Veg filter buttons

  - [ ] **Sort Controls**:

  - Sort pizza on price default, high to low, low to high

- [ ] **Infinite Scroll**:

  - Intersection Observer API implementation
  - Loading states and error handling
  - End-of-list detection

- [ ] **State Management**:
  - Filter/sort state management

**Expected API Examples:**

- `GET /api/pizzas?filter=veg&sortBy=price&sortOrder=asc&page=1&limit=10`

---

## 🎯 **TASK 2: Order Model Design**

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

---

## 🎯 **TASK 3: Webhook Implementation**

### 📋 Requirements

Implement a robust webhook system for order status updates from external delivery services.

### 🔗 Webhook Integration (`backend/src/controllers/webhookController.js`)

### Expected Webhook Payload

```json
{
  "orderId": "60d5f484f4b7a5b8c8f8e123",
  "status": "confirmed" | "preparing" | "out_for_delivery" | "delivered",
  "estimatedDeliveryTime": "2024-03-15T18:30:00Z",
  "deliveryNotes": "Left at front door",
  "timestamp": "2024-03-15T17:45:00Z"
}
```

### Implementation Requirements

#### **1. Payload Validation**

- [ ] Validate payload structure
- [ ] Verify orderId is valid MongoDB ObjectId
- [ ] Check required fields presence

#### **2. Order Status Management**

- [ ] Find order by ID
- [ ] Validate status transitions (prevent invalid progressions)
- [ ] Update order status and related fields
- [ ] Add timestamps for status changes

#### **3. Error Handling**

- [ ] **400 Bad Request**: Invalid payload structure
- [ ] **404 Not Found**: Order not found
- [ ] **409 Conflict**: Invalid status transition
- [ ] **500 Internal Server Error**: Database errors

#### **4. Status Transition Rules**

```javascript
const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [], // Final state
  cancelled: [], // Final state
};
```

#### **5. Idempotency**

- [ ] Handle duplicate webhook calls
- [ ] Prevent race conditions
- [ ] Log webhook events for debugging

### 📍 File Location

- `backend/src/controllers/webhookController.js` - **Complete the implementation**

### 🧪 Testing Considerations

- Test with various payload formats
- Test invalid order IDs and status transitions
- Test duplicate webhook calls
- Test database failures

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment Setup

Create `.env` files in both directories:

**Backend `.env`:**

```
MONGO_URI=mongodb://localhost:27017/pizza-shop
PORT=5000
JWT_SECRET=your-secret-key-here
```

**Frontend `.env`:**

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 4. Test the Application

- Open http://localhost:3000
- Sign up as admin: Use role "admin" during signup
- Default admin credentials: `admin@admin.com` / `password123`

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

## 🎯 Success Criteria

Your implementation will be evaluated on:

- **Technical Skills**: Code quality, architecture, and best practices
- **Problem Solving**: How you handle edge cases and error scenarios
- **Database Design**: Order schema design and data modeling
- **API Design**: RESTful endpoints and query parameter handling
- **User Experience**: Frontend functionality and user interaction

Good luck with the challenge! 🍕
