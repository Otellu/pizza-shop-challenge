import React from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  // This will be replaced with state/context in integration
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [placing, setPlacing] = React.useState(false);

  const handlePlaceOrder = async () => {
    // TODO: implement the place order logic
    // TODO: show loading state
    // TODO: call the place order api
    // TODO: handle success and error cases
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <ul className="mb-4">
        {cart.map((pizza, i) => (
          <li key={i} className="border-b py-2">{pizza.name}</li>
        ))}
      </ul>
      <div className="mb-2">
        <label className="block mb-1">Name</label>
        <input className="border px-2 py-1 w-full" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Address</label>
        <textarea className="border px-2 py-1 w-full" value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Payment Method</label>
        <input type="radio" checked readOnly /> Cash on Delivery
      </div>
      <button disabled={placing} className="bg-red-600 text-white px-4 py-2 rounded" onClick={handlePlaceOrder}>
        {placing ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

export default Checkout;
