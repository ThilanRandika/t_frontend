import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
