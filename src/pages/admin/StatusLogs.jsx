import React, { useEffect, useState } from 'react';
import { notificationApi } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:    { bg: 'rgba(255,193,7,0.15)',  color: '#ffc107' },
  confirmed:  { bg: 'rgba(0,150,136,0.15)',  color: '#009688' },
  processing: { bg: 'rgba(33,150,243,0.15)', color: '#2196f3' },
  shipped:    { bg: 'rgba(156,39,176,0.15)', color: '#9c27b0' },
  delivered:  { bg: 'rgba(76,175,80,0.15)',  color: '#4caf50' },
  cancelled:  { bg: 'rgba(244,67,54,0.15)',  color: '#f44336' },
};

const TYPE_BADGE = {
  status:  { label: 'Order Status',     bg: 'rgba(33,150,243,0.15)', color: '#2196f3', icon: '📦' },
  product: { label: 'Product Update',   bg: 'rgba(255,152,0,0.15)',  color: '#ff9800', icon: '🏷️' },
};

const ACTION_COLORS = {
  created: { bg: 'rgba(76,175,80,0.15)',  color: '#4caf50' },
  updated: { bg: 'rgba(33,150,243,0.15)', color: '#2196f3' },
  deleted: { bg: 'rgba(244,67,54,0.15)',  color: '#f44336' },
};

function TypeBadge({ type }) {
  const config = TYPE_BADGE[type] || { label: type, bg: 'rgba(255,255,255,0.1)', color: 'var(--color-text)', icon: '📋' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: config.bg,
      color: config.color,
      padding: '0.2rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {config.icon} {config.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();
  const style = STATUS_COLORS[s] || { bg: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: '0.2rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {status || 'N/A'}
    </span>
  );
}

function OrderDetailsCell({ order }) {
  if (!order) {
    return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Order data unavailable</span>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>
        <StatusBadge status={order.status} />
      </div>
      <div>
        <span style={{ color: 'var(--color-text-muted)' }}>Total: </span>
        <strong>LKR {(order.totalAmount ?? 0).toLocaleString()}</strong>
      </div>
      {order.items && order.items.length > 0 && (
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Items: </span>
          <span>
            {order.items.map(item =>
              `${item.productName || 'Product'} ×${item.quantity}`
            ).join(', ')}
          </span>
        </div>
      )}
      {order.shippingAddress && (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          📍 {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
}

function ProductDetailsCell({ log }) {
  // Parse product action from body text
  const actionMatch = log.body?.match(/Action: (Created|Updated|Deleted)/i);
  const action = actionMatch ? actionMatch[1].toLowerCase() : null;
  const actionStyle = ACTION_COLORS[action] || { bg: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' };

  const nameMatch = log.body?.match(/Name: (.+)/);
  const categoryMatch = log.body?.match(/Category: (.+)/);
  const priceMatch = log.body?.match(/Price: LKR (.+)/);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Action:</span>
          <span style={{
            background: actionStyle.bg,
            color: actionStyle.color,
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {action}
          </span>
        </div>
      )}
      {nameMatch && (
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Product: </span>
          <strong>{nameMatch[1]}</strong>
        </div>
      )}
      {categoryMatch && categoryMatch[1] !== 'N/A' && (
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Category: </span>
          <span>{categoryMatch[1]}</span>
        </div>
      )}
      {priceMatch && priceMatch[1] !== 'N/A' && (
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Price: </span>
          <strong>LKR {priceMatch[1]}</strong>
        </div>
      )}
    </div>
  );
}

export default function StatusLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Activity Log | ShopEase';
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await notificationApi.getSystemLogs({ limit: 50 });
      setLogs(data.logs || []);
    } catch (err) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 className="mb-3">Admin Activity Log</h1>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Date &amp; Time</th>
              <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Type</th>
              <th style={{ padding: '1rem' }}>Recipient Email</th>
              <th style={{ padding: '1rem', width: '35%' }}>Details</th>
              <th style={{ padding: '1rem', width: '25%' }}>Body Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem', fontSize: '0.85rem', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <TypeBadge type={log.type} />
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', verticalAlign: 'top' }}>
                  {log.recipientEmail}
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  {log.type === 'status' ? (
                    <OrderDetailsCell order={log.orderDetails} />
                  ) : (
                    <ProductDetailsCell log={log} />
                  )}
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-text-muted)',
                    maxHeight: '5em',
                    overflow: 'hidden',
                    background: 'var(--color-surface-2)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                  }}>
                    {log.body}
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
