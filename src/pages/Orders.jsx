import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusClass = (s) => `status-badge status-${s}`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    orderApi.getMyOrders()
      .then((r) => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/products')}>
              <Package size={16} /> Browse Products
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="card order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <div className="order-id">#{order._id}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <span className={statusClass(order.status)}>{order.status}</span>
                <div className="order-total">${order.totalAmount.toFixed(2)}</div>
              </div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item-row" key={idx}>
                    <span>{item.productName} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.status === 'pending' && (
                <div style={{ padding: '0 1.25rem 1rem' }}>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={async () => {
                      try {
                        await orderApi.updateStatus(order._id, 'cancelled');
                        setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, status: 'cancelled' } : o));
                        toast.success('Order cancelled');
                      } catch { toast.error('Failed to cancel order'); }
                    }}
                  >Cancel Order</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
