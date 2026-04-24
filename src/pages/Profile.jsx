import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, Package, Save, Heart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusClass = (s) => `status-badge status-${s}`;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { 
      navigate('/login'); 
      return; 
    }
    fetchProfileData();
  }, [isAuthenticated, navigate]);

  const fetchProfileData = () => {
    setLoading(true);
    userApi.getFullProfile()
      .then((res) => {
        setProfile(res.data.user);
        setEditName(res.data.user.name);
        setWishlist(res.data.wishlist || []);
        
        // Handle gracefully degraded orders if order service is down
        if (res.data.orders.error) {
           toast.error("Order history is temporarily unavailable.");
           setOrders([]);
        } else {
           setOrders(res.data.orders);
        }
      })
      .catch(() => toast.error('Failed to load profile data'))
      .finally(() => setLoading(false));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    setIsSaving(true);
    try {
      await userApi.updateProfile({ name: editName });
      toast.success('Profile updated successfully! A notification has been sent.');
      setIsEditing(false);
      fetchProfileData(); // Refresh to get the latest
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await userApi.toggleWishlist({ productId, action: 'remove' });
      toast.success('Removed from wishlist');
      fetchProfileData();
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!profile) return null;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Dashboard</h1>
          <p>Manage your profile and view your aggregated history</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
          
          {/* Left Column (Profile & Wishlist) */}
          <div>
            {/* Profile Section */}
            <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} className="text-primary" /> Profile Details
              </h2>
              {!isEditing && (
                <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(true)}>
                  <Edit2 size={14} /> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email (Cannot be changed)</label>
                  <input type="email" className="form-control" value={profile.email} disabled />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => {
                    setIsEditing(false);
                    setEditName(profile.name);
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Full Name</label>
                  <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{profile.name}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                  <div style={{ fontSize: '1.1rem' }}>{profile.email}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Role</label>
                  <div><span className="status-badge status-confirmed">{profile.role}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Section */}
          <div className="card" style={{ padding: '2rem', height: 'fit-content', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={20} className="text-primary" /> My Wishlist
            </h2>
            
            {wishlist.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', margin: '2rem 0' }}>Your wishlist is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wishlist.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>${item.price.toFixed(2)}</div>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline" 
                      onClick={() => handleRemoveWishlist(item._id)}
                      title="Remove from wishlist"
                      style={{ padding: '0.4rem' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Aggregation Section (Right Column) */}
        <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} className="text-primary" /> Recent Orders (Aggregated)
            </h2>
            
            {orders.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                <p>No orders found or order service is unavailable.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.slice(0, 5).map((order) => (
                  <div className="card order-card" key={order._id}>
                    <div className="order-header" style={{ padding: '1rem' }}>
                      <div>
                        <div className="order-id">#{order._id}</div>
                        <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                      <span className={statusClass(order.status)}>{order.status}</span>
                      <div className="order-total">${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <button className="btn btn-outline" onClick={() => navigate('/orders')} style={{ width: '100%' }}>
                    View All Orders
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
