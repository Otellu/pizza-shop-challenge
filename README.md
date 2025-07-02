# Pizza Shop Challenge

Welcome to the Pizza Shop Challenge! This is a full-stack application where you'll be implementing various features to complete the pizza ordering system. Below are the tasks organized by features.

## Feature 1: User Authentication System

### Requirements

- [ ] You should be able to create both regular user and admin accounts (signup/register as either role).
- [ ] Users should be able to log in with their credentials and be redirected based on their role. Admins should be redirected to `/admin`, while users should be redirected to `/menu`.
- [ ] Only admin users should be able to access admin-routed pages (e.g., `/admin`); non-admins should be blocked and shown a "Not Authorized" page.

**Involved files:**

- `frontend/src/pages/Login.js`
- `frontend/src/pages/Signup.js`
- `backend/src/controllers/authController.js`
- `backend/src/middleware/auth.js`
- `backend/src/middleware/admin.js`
- `frontend/src/App.js`

## Feature 2: Find the perfect pizza

### User Experience Requirements

The user should be able to filter and sort the pizzas, scroll until no new pizzas are visible, and receive feedback once they click on a pizza to order.

- [ ] **Filtering**: Users should be able to filter pizzas by:

  - All pizzas (no filter)
  - Vegetarian only
  - Non-vegetarian only

- [ ] **Sorting**: Users should be able to sort pizzas by:

  - Price: Low to High
  - Price: High to Low
  - Default order (as stored in database)

- [ ] **Infinite Loading**:

  - Load pizzas in batches (e.g., 10-15 pizzas per page)
  - Automatically load more pizzas when user scrolls near the bottom
  - Show loading indicator while fetching more pizzas
  - Handle end of list gracefully

- [ ] **Pizza Selection**:
  - Users can add multiple pizzas to their cart
  - Show visual feedback when pizza is added to cart
  - Prevent duplicate additions to cart
  - Display cart count/badge in navigation

**Involved files:**

- `frontend/src/components/PizzaList.js`
- `backend/src/controllers/pizzaController.js`

## Feature 3: Handle the orders

### User Experience Requirements

- [ ] **Order Creation**: Users should be able to create an order containing multiple pizzas from their cart.
- [ ] **Order History**: Users should be able to view their past orders.
- [ ] **Admin Order Table**:
  - Admins should see the newest orders at the top of the table (sorted by creation date, newest first).
  - Admins should be able to filter orders by multiple statuses (e.g., pending, preparing, delivered, cancelled).

## Feature 4: Order Status Updates

### User Experience Requirements

- [ ] The order system should automatically update the status of an order when a webhook is received (e.g., from a delivery service or payment provider).
- [ ] The update should be safe and reliable, ensuring only valid status changes are applied.
- [ ] Users and admins should see the updated status reflected in their order views.

### Backend Components

- [ ] **Webhook Handler** (`/backend/src/controllers/webhookController.js`)
  - Expose a route that receives webhook events containing an `orderId` and a new `status`.
  - Validate the incoming data (ensure the order exists, status is valid, etc.).
  - Safely update the order's status in the database.
  - Handle errors gracefully (e.g., invalid orderId, invalid status, etc.).
  - Optionally, log webhook events for auditing/debugging purposes.

## Getting Started

1. Install dependencies for both frontend and backend:

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. Create a `.env` file in the both backend and frontend directory with the required environment variables

3. Start the development servers:

   ```bash
   # Frontend (from frontend directory)
   npm start

   # Backend (from backend directory)
   npm run dev
   ```

## Submission

- Complete all the TODO items in the codebase
- Ensure all features work as expected
- Follow best practices for code organization and error handling
- Document any additional setup steps if needed

Good luck with the challenge! 🍕
