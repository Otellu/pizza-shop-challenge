import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    // TODO: call the login api and store the token and role
    // TODO: redirect to /admin or /menu based on role
    // TODO: show success or error message
    e.preventDefault();
    try {

    } catch (err) {
      toast.error('Network error.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Login to PizzaShop</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" name="password" required value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        <button type="submit" className="w-full py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition flex items-center justify-center" disabled={isLoading}>
          {isLoading ? <Loader /> : null}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-red-600 font-semibold hover:underline">Signup</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
