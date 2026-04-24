import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi, userApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Food', 'Sports', 'Home', 'Other'];

const EMOJI_MAP = {
  Electronics: '💻', Clothing: '👕', Books: '📚', Food: '🍕', Sports: '⚽', Home: '🏠', Other: '📦',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your wishlist');
      return;
    }
    try {
      await userApi.toggleWishlist({ productId, action: 'add' });
      toast.success('Added to wishlist! Check your Profile Dashboard.');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  useEffect(() => {
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;

    setLoading(true);
    productApi.getAll(params)
      .then((r) => setProducts(r.data.products))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Product Catalog</h1>
          <p>Explore our curated collection of premium products</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {EMOJI_MAP[cat] || ''} {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div className="card product-card" key={p._id}>
                <div className="product-img-placeholder">{EMOJI_MAP[p.category] || '📦'}</div>
                <div className="card-body">
                  <div className="product-category">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-footer">
                    <div>
                      <div className="product-price">${p.price.toFixed(2)}</div>
                      <div className="product-stock">
                        {p.stock > 0 ? `${p.stock} in stock` : <span className="text-danger">Out of stock</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleWishlist(p._id)}
                        title="Add to Wishlist"
                      >
                        <Heart size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => { addToCart(p); toast.success('Added to cart!'); }}
                        disabled={p.stock === 0}
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
