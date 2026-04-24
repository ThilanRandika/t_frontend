import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Home, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { count, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">ShopEase</Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link"><Home size={16} /><span>Home</span></Link>
          <Link to="/products" className="nav-link"><Package size={16} /><span>Products</span></Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link"><span>Orders</span></Link>
              <Link to="/my-notifications" className="nav-link"><span>Inbox</span></Link>
              <button
                className="nav-link"
                onClick={() => setIsOpen(true)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: 'var(--color-accent)', color: '#fff',
                    borderRadius: '50%', width: '18px', height: '18px',
                    fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700
                  }}>{count}</span>
                )}
              </button>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textDecoration: 'none' }}>
                <User size={14} />
                <span style={{ color: 'var(--color-text-muted)' }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
