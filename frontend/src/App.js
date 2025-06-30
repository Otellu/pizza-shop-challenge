import React from 'react';
import { CartProvider } from './components/CartContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import UserLanding from './pages/UserLanding';
import NotAuthorized from './pages/NotAuthorized';
import RequireAuth from './components/RequireAuth';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';

function Layout({ children }) {
  const location = useLocation();
  const showNavFooter = location.pathname !== '/login' && location.pathname !== '/signup';
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavFooter && <Navbar />}
      <div className="flex-grow">{children}</div>
      {showNavFooter && <Footer />}
    </div>
  );
}

function AppContent() {
  console.log(localStorage.getItem('role'))
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={
          <RequireAuth>
            <UserLanding />
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAuth>
            {localStorage.getItem('role') === 'admin' ? <AdminDashboard /> : <NotAuthorized />}
          </RequireAuth>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
          <AppContent />
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
