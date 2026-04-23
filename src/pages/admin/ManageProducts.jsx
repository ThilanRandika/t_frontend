import React, { useEffect, useState } from 'react';
import { productApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', imageUrl: '', stockCount: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productApi.getAll({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await productApi.create({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stockCount) || 0
      });
      toast.success('Product added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: '', category: '', imageUrl: '', stockCount: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.details || err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to add product');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem' }}>Add New Product</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Product Name</label>
                <input className="form-input" type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="" disabled>Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Food">Food</option>
                  <option value="Sports">Sports</option>
                  <option value="Home">Home</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Price (LKR)</label>
                <input className="form-input" type="number" min="0" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Stock Count</label>
                <input className="form-input" type="number" min="0" required value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="form-label">Image URL</label>
              <input className="form-input" type="url" required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input" required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Product</button>
          </form>
        </div>
      )}
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {products.map(product => (
          <div key={product._id} className="card p-0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>LKR {product.price.toLocaleString()}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stock: {product.stock}</span>
              </div>
            </div>
            <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(255,0,0,0.05)' }}>
              <button onClick={() => handleDelete(product._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.5rem', fontWeight: 600 }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="card p-4 text-center text-muted">No products found.</div>
      )}
    </div>
  );
}
