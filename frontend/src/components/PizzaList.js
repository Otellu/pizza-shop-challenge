import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useCart } from './CartContext';

// Infinite scroll + filtering demo (fetch logic to be implemented)
function PizzaList({ filters, onFilterChange }) {
  const { cart, addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  // Fetch pizzas from backend
  const fetchPizzas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/pizzas`);
      const data = await res.json();
      setPizzas(data);
      setHasMore(false); // Disable infinite scroll for now
    } catch (e) {
      setPizzas([]);
      setHasMore(false);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    if (hasMore && !loading) fetchPizzas();
    // eslint-disable-next-line
  }, [filters]);

  const lastPizzaRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchPizzas();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchPizzas]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pizzas.map((pizza, idx) => (
          <div
            key={pizza._id || pizza.id}
            ref={idx === pizzas.length - 1 ? lastPizzaRef : null}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
          >
            <img
              src={pizza.image ? `./${pizza.image}` : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'}
              alt={pizza.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{pizza.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{pizza.ingredients?.join(', ')}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-red-600">₹{pizza.price}</span>
                {cart.some(item => (item._id || item.id) === (pizza._id || pizza.id)) ? (
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-500 rounded-full font-semibold cursor-not-allowed"
                    disabled
                  >
                    In Cart
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow"
                    onClick={() => addToCart(pizza)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center py-4">Loading more...</div>}
      {!hasMore && <div className="text-center py-4">No more pizzas</div>}
    </div>
  );
}

export default React.memo(PizzaList);
