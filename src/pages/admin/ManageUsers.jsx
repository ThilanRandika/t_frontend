import React, { useEffect, useState } from 'react';
import { userApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await userApi.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 className="mb-3">Manage Users</h1>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge`} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-surface-2)', fontSize: '0.8rem', color: user.role === 'admin' ? '#fff' : 'var(--color-text)' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
