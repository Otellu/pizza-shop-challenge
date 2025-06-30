import React, { useEffect, useRef, useCallback, useState } from "react";
import { useCart } from "./CartContext";
import FilterButton from "./FilterButton";

// Infinite scroll + filtering demo (fetch logic to be implemented)
function PizzaList() {
  const { cart, addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);

  // Fetch pizzas from backend (once on mount)
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/pizzas`;
        const res = await fetch(url);
        const data = await res.json();
        setPizzas(data);
      } catch (e) {
        setPizzas([]);
      }
    };
    fetchPizzas();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Filter and Sort Controls (static, non-interactive) */}
      <div className="flex justify-between mb-6 gap-4 flex-wrap items-center">
        <div className="flex gap-2 mb-2 sm:mb-0">
          <FilterButton text="All" active={true} />
          <FilterButton text="Veg" active={false} />
          <FilterButton text="Non-Veg" active={false} />
        </div>
        <div className="ml-4">
          <select
            className="px-4 py-2 rounded-full border font-semibold text-gray-700 bg-white shadow focus:outline-none cursor-default"
            value="default"
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div
            key={pizza._id || pizza.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
          >
            <div className="relative w-full h-40">
              <img
                src={
                  pizza.image
                    ? `./${pizza.image}`
                    : "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
                }
                alt={pizza.name}
                className="w-full h-40 object-cover"
              />
              {/* Veg/Non-Veg Icon Overlay */}
              {pizza.veg ? (
                <span
                  title="Veg"
                  className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow"
                >
                  <span className="block w-3 h-3 bg-green-600 rounded-full border-2 border-green-800" />
                </span>
              ) : (
                <span
                  title="Non-Veg"
                  className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow"
                >
                  <span className="block w-3 h-3 bg-red-600 rounded-full border-2 border-red-800" />
                </span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {pizza.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {pizza.ingredients?.join(", ")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-red-600">
                  ₹{pizza.price}
                </span>
                {cart.some(
                  (item) => (item._id || item.id) === (pizza._id || pizza.id)
                ) ? (
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
    </div>
  );
}

export default React.memo(PizzaList);
