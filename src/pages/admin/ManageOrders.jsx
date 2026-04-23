import React, { useEffect, useState } from 'react';
import { orderApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderApi.getAllOrders({ limit: 50 });
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 className="mb-3">Manage Orders</h1>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Customer Email</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Current Status</th>
              <th style={{ padding: '1rem' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem', fontSize: '0.9rem', fontFamily: 'monospace' }}>{order._id.substring(order._id.length - 6)}</td>
                <td style={{ padding: '1rem' }}>{order.userEmail}</td>
                <td style={{ padding: '1rem' }}>LKR {(order.totalAmount || 0).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--color-surface-2)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: '0.3rem', borderRadius: '4px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
