import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      // TODO: Implement the fetch orders logic for admin
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
                {/* // TODO add order columns  */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                // TODO implement Order UI
                <p>TODO: implement order ui</p>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
