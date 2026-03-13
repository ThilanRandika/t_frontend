import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartSidebar() {
  const { items, removeFromCart, updateQty, clearCart, total, isOpen, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate('/login'); setIsOpen(false); return; }
    setLoading(true);
    try {
      await orderApi.create({
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: { street: '123 Main St', city: 'Colombo', country: 'Sri Lanka', postalCode: '00100' },
      });
      clearCart();
      setIsOpen(false);
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart ({items.length})</h3>
          <button className="btn btn-sm btn-outline" onClick={() => setIsOpen(false)}><X size={16} /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛒</div>
              <h3>Cart is empty</h3>
              <p>Add some products to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="cart-qty">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)}>–</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                </div>
                <button style={{ color: 'var(--color-danger)', padding: '0.25rem' }} onClick={() => removeFromCart(item._id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="text-success">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
