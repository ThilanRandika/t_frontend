import React, { useEffect, useState } from 'react';
import { orderApi, productApi, userApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: 0,
    products: 0,
    orders: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          orderApi.getAllOrders({ limit: 1000 }),
          productApi.getAll({ limit: 1000 }),
          userApi.getAllUsers()
        ]);

        const orders = ordersRes.data.orders || [];
        const sales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats({
          sales,
          orders: ordersRes.data.pagination?.total || orders.length,
          products: productsRes.data.pagination?.total || productsRes.data.products?.length || 0,
          users: usersRes.data.users?.length || 0
        });
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 className="mb-2">Admin Dashboard</h1>
      <p className="text-muted">Welcome to the ShopEase Administrator Portal. From here you can manage products, orders, and users.</p>
      
      <div className="grid grid-cols-4 gap-4 mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card p-4">
          <h3 className="mb-1" style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Total Sales</h3>
          <p className="text-2xl font-bold" style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>LKR {stats.sales.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <h3 className="mb-1" style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Total Orders</h3>
          <p className="text-2xl font-bold" style={{ fontSize: '1.8rem' }}>{stats.orders}</p>
        </div>
        <div className="card p-4">
          <h3 className="mb-1" style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Active Products</h3>
          <p className="text-2xl font-bold" style={{ fontSize: '1.8rem' }}>{stats.products}</p>
        </div>
        <div className="card p-4">
          <h3 className="mb-1" style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Registered Users</h3>
          <p className="text-2xl font-bold" style={{ fontSize: '1.8rem' }}>{stats.users}</p>
        </div>
      </div>
    </div>
  );
}
