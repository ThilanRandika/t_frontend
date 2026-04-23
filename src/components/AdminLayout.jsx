import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Store, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text)',
    background: isActive(path) ? 'var(--color-surface-2)' : 'transparent',
    borderLeft: isActive(path) ? '3px solid var(--color-primary)' : '3px solid transparent',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 600 : 500,
    transition: 'all 0.2s'
  });

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <Store size={24} /> ShopEase
          </Link>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
            <li>
              <Link to="/admin/dashboard" style={getLinkStyle('/admin/dashboard')}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" style={getLinkStyle('/admin/products')}>
                <Package size={18} /> Manage Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>
                <ShoppingCart size={18} /> Manage Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/users" style={getLinkStyle('/admin/users')}>
                <Users size={18} /> Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/status-logs" style={getLinkStyle('/admin/status-logs')}>
                <Activity size={18} /> Status Logs
              </Link>
            </li>
            <li>
              <Link to="/" style={{ ...getLinkStyle('/'), marginTop: '1rem', color: 'var(--color-text-muted)', borderLeft: 'none' }}>
                <Store size={18} /> Back to Store
              </Link>
            </li>
          </ul>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'var(--color-surface)', height: '60px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 500, color: 'var(--color-text-muted)' }}>Admin Portal</h2>
        </header>
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
