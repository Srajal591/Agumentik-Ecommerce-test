import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { colors, spacing, shadows } from '../theme/colors';
import { MdAdd, MdDelete, MdSearch, MdFilterList } from 'react-icons/md';
import { showSuccess, showError, showConfirmation } from '../utils/toast';

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
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    showConfirmation(
      'Are you sure you want to delete this product?',
      async () => {
        try {
          const response = await productService.delete(id);
          if (response.success) {
            showSuccess('Product deleted successfully');
            fetchProducts();
          } else {
            showError('Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          showError('Failed to delete product');
        }
      }
    );
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <motion.div 
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Products Management</h1>
          <p style={styles.subtitle}>Manage your product catalog</p>
        </div>
        <motion.button 
          onClick={() => window.location.href = '/add-product'} 
          style={styles.addButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdAdd size={20} />
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div 
        style={styles.filters}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div style={styles.searchContainer}>
          <MdSearch size={20} color={colors.textSecondary} />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.selectContainer}>
          <MdFilterList size={20} color={colors.textSecondary} />
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
      </motion.div>

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            style={styles.card}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, boxShadow: shadows.md }}
          >
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
                <motion.button 
                  onClick={() => handleDelete(product._id)} 
                  style={styles.deleteButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdDelete size={16} />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <motion.button
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          disabled={pagination.page === 1}
          style={{
            ...styles.paginationButton,
            opacity: pagination.page === 1 ? 0.5 : 1,
            cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
          }}
          whileHover={pagination.page !== 1 ? { scale: 1.02 } : {}}
          whileTap={pagination.page !== 1 ? { scale: 0.98 } : {}}
        >
          Previous
        </motion.button>
        <span style={styles.paginationInfo}>
          Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <motion.button
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          style={{
            ...styles.paginationButton,
            opacity: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 0.5 : 1,
            cursor: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'not-allowed' : 'pointer',
          }}
          whileHover={pagination.page < Math.ceil(pagination.total / pagination.limit) ? { scale: 1.02 } : {}}
          whileTap={pagination.page < Math.ceil(pagination.total / pagination.limit) ? { scale: 0.98 } : {}}
        >
          Next
        </motion.button>
      </div>
    </motion.div>
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
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '12px 24px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: '14px',
    color: colors.textSecondary,
    margin: 0,
  },
  filters: {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  searchContainer: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: '10px 14px',
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: '10px 14px',
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    minWidth: '200px',
  },
  select: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: shadows.sm,
    transition: 'all 0.3s ease',
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
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
    padding: spacing.md,
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
    fontSize: '13px',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
    borderRadius: '20px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: '8px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: '12px',
    boxShadow: shadows.sm,
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
    transition: 'all 0.2s',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
    fontWeight: '500',
  },
};

// Add scrollbar styling
const scrollbarStyles = `
  .tableWrapper {
    display: block;
  }

  .tableWrapper table {
    display: table;
    table-layout: auto;
  }

  .tableWrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .tableWrapper::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }

  .tableWrapper::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 4px;
  }

  .tableWrapper::-webkit-scrollbar-thumb:hover {
    background: ${colors.primary};
  }

  @media (max-width: 1024px) {
    .tableWrapper {
      max-height: 500px !important;
    }
  }

  @media (max-width: 768px) {
    .tableWrapper {
      max-height: 450px !important;
    }
  }

  @media (max-width: 480px) {
    .tableWrapper {
      max-height: 400px !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('products-scrollbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'products-scrollbar-styles';
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

export default Products;
