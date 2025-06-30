import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log(process.env.REACT_APP_API_URL)
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [summaryRes, ordersRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.REACT_APP_API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const summary = await summaryRes.json();
        const ordersData = await ordersRes.json();
        setStats(summary);
        setOrders(ordersData.orders || []);
      } catch (err) {
        toast.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader className="h-8 w-8 text-red-600" /></div>;
  if (!stats) return <div className="text-center mt-10 text-red-600">Failed to load dashboard.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalOrders}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.ordersToday}</div>
          <div className="text-gray-600">Orders Today</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalUsers}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Incoming Orders</h2>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-gray-500">No incoming orders.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.user?.name || 'N/A'}</td>
                  <td className="p-2 capitalize">{order.status}</td>
                  <td className="p-2">₹{order.total}</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
