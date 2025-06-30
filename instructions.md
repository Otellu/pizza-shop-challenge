# Pizza Shop Challenge - Implementation Instructions

Welcome to the Pizza Shop Challenge! This project is a full-stack application with React frontend and Express backend. Your task is to implement the missing functionality marked with TODO comments throughout the codebase.

## Quick Setup

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Copy .env.example to .env and configure MongoDB URI
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## What You Need to Implement

### 🔐 Authentication & Authorization

#### Backend Middleware
- **`backend/src/middleware/auth.js`** - JWT token validation middleware
  - Extract token from `Authorization: Bearer <token>` header
  - Verify token using JWT_SECRET
  - Attach user to `req.user`
  - Handle error cases (no token, invalid format, verification failed, user not found)

- **`backend/src/middleware/admin.js`** - Admin role verification middleware
  - Validate JWT token
  - Check if user has admin role
  - Return 401 for invalid tokens, 403 for non-admin users

#### Frontend Authentication Pages
- **`frontend/src/pages/Login.js`** - User login functionality
  - Call login API endpoint
  - Store JWT token and user role in localStorage
  - Redirect to `/admin` or `/menu` based on user role
  - Show success/error messages

- **`frontend/src/pages/Signup.js`** - User registration functionality
  - Call signup API endpoint
  - Handle form submission with proper validation
  - Redirect after successful registration

### 🛒 Order Management

#### Frontend Order Processing
- **`frontend/src/pages/Checkout.js`** - Order placement functionality
  - Implement place order logic with loading states
  - Call place order API endpoint
  - Handle success and error cases
  - Clear cart after successful order

#### Backend Order Features
- **`backend/src/controllers/adminController.js`** - Admin order management
  - Sort orders so "pending" orders appear at the top
  - Currently orders are sorted by creation date only

#### Admin Dashboard
- **`frontend/src/pages/AdminDashboard.js`** - Order listing for admin
  - Fetch all orders from API
  - Display orders in the existing table structure
  - Handle loading and error states

### 🍕 Pizza Management

- **`backend/src/controllers/pizzaController.js`** - Pizza filtering
  - Add filter functionality to filter pizzas by vegetarian status
  - Support query parameter for veg/non-veg filtering

### 📦 Webhook Integration

- **`backend/src/controllers/webhookController.js`** - Delivery status updates
  - Handle incoming webhook events
  - Update order status based on webhook data
  - Process delivery status changes

## Key Technical Requirements

### Authentication Flow
1. Users register/login through frontend forms
2. Backend validates credentials and returns JWT token
3. Frontend stores token and user role in localStorage
4. Protected routes use JWT middleware for authorization
5. Admin routes additionally check for admin role

### Order Processing Flow
1. Users add pizzas to cart (already implemented)
2. Checkout page collects delivery details
3. Place order API creates order in database
4. Admin dashboard shows all orders with pending orders prioritized
5. Webhook endpoint handles delivery status updates

### API Integration Points
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration  
- `POST /api/orders` - Place new order
- `GET /api/admin/orders` - Fetch all orders (admin only)
- `GET /api/pizzas?veg=true/false` - Filter pizzas by type
- `POST /api/webhook/delivery-update` - Handle delivery status updates

## Expected Behavior

### User Experience
- Seamless authentication with proper error handling
- Role-based navigation (admin → dashboard, user → menu)
- Smooth checkout process with order confirmation
- Real-time order status updates via webhooks

### Admin Experience  
- Comprehensive order management dashboard
- Orders sorted by status (pending first)
- Easy access to customer and order details

## Testing Your Implementation

1. **Authentication:** Test login/signup with valid and invalid credentials
2. **Authorization:** Verify admin-only routes are protected
3. **Orders:** Place orders and verify they appear in admin dashboard
4. **Filtering:** Test pizza filtering by vegetarian status
5. **Webhooks:** Test delivery status updates via webhook endpoint

Good luck with the implementation! Focus on clean, maintainable code and proper error handling throughout.