import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        toast.error('Failed to fetch orders');
        setOrders([]);
      }
      setLoadingOrders(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Dashboard</h1>
      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow mb-8 p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">All Orders</h2>
        {loadingOrders ? (
          <div className="text-center py-8"><Loader className="h-8 w-8 text-red-600 mx-auto" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No orders found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pizzas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ordered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="px-4 py-2 whitespace-nowrap">{order.user ? order.user.name : <span className="text-gray-400 italic">N/A</span>}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.user ? order.user.email : <span className="text-gray-400 italic">N/A</span>}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {order.pizzas.map(pizza => (
                        <span key={pizza._id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {pizza.veg ? (
                            <span title="Veg" className="inline-block w-3 h-3 bg-green-600 rounded-full border border-green-800" />
                          ) : (
                            <span title="Non-Veg" className="inline-block w-3 h-3 bg-red-600 rounded-full border border-red-800" />
                          )}
                          {pizza.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.address}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
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
