import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);
    try {
      const res = await login(form);
      if (res.token && res.user) {
        setSuccess('Login successful!');
        toast.success('Login successful!');
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        setTimeout(() => {
          if (res.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/menu');
          }
        }, 1000);
      } else {
        setError(res.message || 'Login failed.');
        toast.error(res.message || 'Login failed.');
      }
    } catch (err) {
      setError('Network error.');
      toast.error('Network error.');
    } finally {
      setIsLoading(false);
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
