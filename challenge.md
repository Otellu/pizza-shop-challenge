# Pizza Shop Challenge

Welcome to the Pizza Shop Challenge! This is a full-stack application where you'll be implementing various features to complete the pizza ordering system. Below are the tasks you need to complete.

## Frontend Tasks

### 1. Authentication

- [ ] **Login Page** (`/frontend/src/pages/Login.js`)

  - Implement the login API call to authenticate users
  - Store the authentication token and user role upon successful login
  - Redirect users based on their role:
    - Admin users should be redirected to `/admin`
    - Regular users should be redirected to `/menu`
  - Display appropriate success/error messages

- [ ] **Signup Page** (`/frontend/src/pages/Signup.js`)
  - Implement the signup API call
  - Handle successful registration and redirect to the login page

### 2. Order Management

- [ ] **Checkout Page** (`/frontend/src/pages/Checkout.js`)

  - Implement the place order functionality
  - Add loading state during order submission
  - Call the place order API
  - Handle both success and error cases appropriately
  - Redirect to order confirmation page on success

- [ ] **Admin Dashboard** (`/frontend/src/pages/AdminDashboard.js`)
  - Implement the logic to fetch and display all orders for admin view

## Backend Tasks

### 1. Models

- [ ] **Order Model** (`/backend/src/models/Order.js`)
  - Implement the Order schema to manage customer orders.
  - Order status should support: 'pending', 'preparing', 'delivered', and 'cancelled'
  - Add other fields as per your understanding

### 2. Authentication Middleware

- [ ] **Admin Middleware** (`/backend/src/middleware/admin.js`)

  - Implement token validation to allow only admin users
  - Add proper error handling for unauthorized access

- [ ] **Auth Middleware** (`/backend/src/middleware/auth.js`)
  - Implement JWT validation with proper error handling

### 2. Pizza Controller

- [ ] **Pizza Filtering** (`/backend/src/controllers/pizzaController.js`)
  - Implement filtering of pizzas by vegetarian/non-vegetarian option

### 3. Webhook Controller

- [ ] **Webhook Handler** (`/backend/src/controllers/webhookController.js`)
  - Handle incoming webhook events
  - Update order status based on webhook events

### 4. Admin Controller

- [ ] **Order Sorting** (`/backend/src/controllers/adminController.js`)
  - Sort orders so that "pending" orders appear at the top

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

2. Create a `.env` file in the backend directory with the required environment variables

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
