import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const openOrderDetail = async (orderId) => {
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      setSelectedOrder(null);
    }
    setDetailLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Order History</h1>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {/* TODO implement order ui */}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl" onClick={() => setSelectedOrder(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-red-600">Order Details</h3>
            {detailLoading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <>
                {/* TODO implement order detail */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
