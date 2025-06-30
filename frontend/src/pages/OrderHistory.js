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
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm hover:bg-gray-50 transition cursor-pointer" onClick={() => openOrderDetail(order._id)}>
              <div className="flex flex-wrap items-center justify-between mb-2">
                <div className="flex gap-2 flex-wrap">
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
              </div>
              <div className="text-gray-600 text-sm mb-1">Address: {order.address}</div>
              <div className="text-gray-400 text-xs">Ordered at: {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          ))}
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
                <div className="mb-2">
                  <span className="font-semibold">Status: </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedOrder.status}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Address:</span> {selectedOrder.address}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Ordered at:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Pizzas:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {selectedOrder.pizzas.map(pizza => (
                      <li key={pizza._id} className="flex items-center gap-2">
                        {pizza.veg ? (
                          <span title="Veg" className="inline-block w-3 h-3 bg-green-600 rounded-full border border-green-800" />
                        ) : (
                          <span title="Non-Veg" className="inline-block w-3 h-3 bg-red-600 rounded-full border border-red-800" />
                        )}
                        <span>{pizza.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
