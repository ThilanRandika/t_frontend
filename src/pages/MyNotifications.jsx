import React, { useState, useEffect } from 'react';
import { notificationApi } from '../services/api';
import { Bell, Mail, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assume user has email

  useEffect(() => {
    // If we only have auth for testing, we might just mock the email if absent
    const fetchHistory = async () => {
      const email = user?.email || "demo@beddings.lk"; 
      try {
        const { data } = await notificationApi.getHistory(email);
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load inbox');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="container page">
      <div className="page-header mb-3 mt-2">
        <h1 className="flex-center gap-1 mb-1 justify-start">
          <Bell className="text-primary" size={32} /> My Inbox
        </h1>
        <p className="text-muted">Stay up to date with your Beddings.lk order confirmations and news.</p>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : notifications.length === 0 ? (
        <div className="empty-state card">
          <Mail size={48} className="text-muted mb-2 mx-auto" />
          <h3>No Notifications Yet!</h3>
          <p>Your inbox is empty. Try placing an order to see updates here.</p>
        </div>
      ) : (
        <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => (
            <div key={notif._id} className="card p-4" style={{ padding: '1.5rem', background: notif.isRead ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
              <div className="flex justify-between items-start mb-2">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)' }}>{notif.subject}</h3>
                <div className="flex-center gap-1 text-muted" style={{ fontSize: '0.8rem' }}>
                  <Clock size={14} /> 
                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <span className={`status-badge ${notif.type === 'welcome' ? 'status-confirmed' : 'status-shipped'} mb-2`} style={{ display: 'inline-block' }}>
                {notif.type.toUpperCase() }
              </span>
              <div className="text-muted mt-2" style={{ whiteSpace: 'pre-wrap', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                {notif.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotifications;
