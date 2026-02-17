import { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { colors, spacing } from '../theme/colors';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', category: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response.success) {
        setProducts(response.data.products);
        setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await productService.delete(id);
      if (response.success) {
        alert('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products Management</h1>
        <button onClick={() => window.location.href = '/add-product'} style={styles.addButton}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={styles.searchInput}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product._id} style={styles.card}>
            <div style={styles.imageContainer}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>No Image</div>
              )}
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productBrand}>{product.brand}</p>
              <div style={styles.priceRow}>
                <span style={styles.price}>₹{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                  <span style={styles.originalPrice}>₹{product.price}</span>
                )}
              </div>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: product.status === 'active' ? colors.successLight : colors.errorLight,
                  color: product.status === 'active' ? colors.success : colors.error,
                }}
              >
                {product.status}
              </span>
              <div style={styles.cardActions}>
                <button onClick={() => handleDelete(product._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          disabled={pagination.page === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span style={styles.paginationInfo}>
          Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: colors.textSecondary,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  filters: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '200px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textSecondary,
    fontSize: '14px',
  },
  cardContent: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  productBrand: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: '14px',
    color: colors.textSecondary,
    textDecoration: 'line-through',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  cardActions: {
    display: 'flex',
    gap: spacing.xs,
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: '12px',
    flexWrap: 'wrap',
  },
  paginationButton: {
    padding: '8px 16px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
};

export default Products;
