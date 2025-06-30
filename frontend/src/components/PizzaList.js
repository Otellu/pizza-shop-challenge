import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useCart } from './CartContext';

// Infinite scroll + filtering demo (fetch logic to be implemented)
function PizzaList({ filters, onFilterChange }) {
  // Local filter state if not provided from parent
  const [localFilter, setLocalFilter] = useState(filters || { veg: undefined });
  // Handle filter change
  const handleFilterChange = (veg) => {
    setLocalFilter({ veg });
    if (onFilterChange) onFilterChange({ veg });
  };
  const { cart, addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  // Fetch pizzas from backend
  const fetchPizzas = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/pizzas`;
      if (filters && typeof filters.veg !== 'undefined') {
        url += `?veg=${filters.veg}`;
      }
      const res = await fetch(url);
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
      {/* Filter Controls */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded-full font-semibold border transition-all ${localFilter.veg === undefined ? 'bg-red-500 text-white' : 'bg-white text-red-500 border-red-500'}`}
          onClick={() => handleFilterChange(undefined)}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold border transition-all ${localFilter.veg === true ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-green-600'}`}
          onClick={() => handleFilterChange(true)}
        >
          Veg
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold border transition-all ${localFilter.veg === false ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-red-600'}`}
          onClick={() => handleFilterChange(false)}
        >
          Non-Veg
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pizzas.map((pizza, idx) => (
          <div
            key={pizza._id || pizza.id}
            ref={idx === pizzas.length - 1 ? lastPizzaRef : null}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
          >
            <div className="relative w-full h-40">
              <img
                src={pizza.image ? `./${pizza.image}` : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'}
                alt={pizza.name}
                className="w-full h-40 object-cover"
              />
              {/* Veg/Non-Veg Icon Overlay */}
              {pizza.veg ? (
                <span title="Veg" className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                  <span className="block w-3 h-3 bg-green-600 rounded-full border-2 border-green-800" />
                </span>
              ) : (
                <span title="Non-Veg" className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                  <span className="block w-3 h-3 bg-red-600 rounded-full border-2 border-red-800" />
                </span>
              )}
            </div>
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
