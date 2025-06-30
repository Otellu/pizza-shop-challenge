# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack pizza shop application with separate frontend and backend services:

- **Frontend**: React app with Tailwind CSS located in `/frontend/`
- **Backend**: Express.js API with MongoDB located in `/backend/`

## Development Commands

### Frontend (React)
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start development server (port 3000)
npm run build       # Build for production
npm test           # Run tests
```

### Backend (Express/Node.js)
```bash
cd backend
npm install         # Install dependencies (also runs seed-db.js via postinstall)
npm run dev        # Start development server with nodemon
npm start          # Start production server
```

## Architecture Overview

### Backend Architecture
- **Entry Point**: `src/app.js` - Express server setup with MongoDB connection
- **Routes**: Modular route structure in `src/routes/`
  - `/api/pizzas` - Pizza management
  - `/api/orders` - Order processing
  - `/api/auth` - Authentication (login/signup)
  - `/api/admin` - Admin dashboard functionality
  - `/api/webhook` - Delivery update webhooks (5s simulated delay)
- **Models**: Mongoose schemas in `src/models/` (Pizza, User, Order)
- **Middleware**: Authentication, admin role checks, and logging
- **Authentication**: JWT-based with bcryptjs for password hashing

### Frontend Architecture
- **Router**: React Router with protected routes using `RequireAuth` component
- **State Management**: Context API with `CartProvider` for shopping cart
- **Authentication**: Role-based access (user/admin) stored in localStorage
- **UI Framework**: Tailwind CSS with react-hot-toast for notifications
- **Key Pages**:
  - Landing page, user menu, admin dashboard
  - Authentication (login/signup)
  - Checkout and order history

### Database Models
- **User**: Authentication with role field (user/admin)
- **Pizza**: Menu items with pricing and descriptions
- **Order**: Order tracking with user association

## Environment Setup

Backend requires a `.env` file with:
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (defaults to 5000)  
- `JWT_SECRET` - JWT signing secret

Use `backend/.env.example` as a template.

## Key Features
- Multi-filtering UI (scaffolded in frontend)
- Infinite scroll (scaffolded in frontend)
- Webhook endpoint for delivery updates with simulated delays
- Role-based access control (user/admin)
- Shopping cart with persistent state
- Order management and history tracking