import { useState, useEffect } from 'react';
import { colors, spacing } from '../../theme/colors';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import axios from '../../api/axios';
import { showSuccess, showError } from '../../utils/toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products?page=${pagination.page}&limit=${pagination.limit}`);
      
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

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const response = await axios.patch(`/products/${productId}/status`, {
        isActive: !currentStatus,
      });
      
      if (response.success) {
        showSuccess('Product status updated successfully');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      showError('Failed to update product status');
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
          <MdAdd size={20} /> Add Product
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.tableWrapper} className="tableWrapper">
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} style={styles.productImage} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                  </td>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.category?.name || 'N/A'}</td>
                  <td style={styles.td}>₹{product.price}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.stockBadge,
                        backgroundColor: product.stock > 10 ? colors.successLight : product.stock > 0 ? colors.warningLight : colors.errorLight,
                        color: product.stock > 10 ? colors.success : product.stock > 0 ? colors.warning : colors.error,
                      }}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: product.isActive ? colors.successLight : colors.errorLight,
                        color: product.isActive ? colors.success : colors.error,
                      }}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleToggleStatus(product._id, product.isActive)}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: product.isActive ? colors.warning : colors.success,
                      }}
                      title={product.isActive ? 'Hide Product' : 'Show Product'}
                    >
                      {product.isActive ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div style={styles.emptyState}>
            <p>No products found.</p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              style={{
                ...styles.paginationButton,
                opacity: pagination.page === 1 ? 0.5 : 1,
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              style={{
                ...styles.paginationButton,
                opacity: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 0.5 : 1,
                cursor: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    width: '100%',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: colors.textSecondary,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.md,
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '600px',
    position: 'relative',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '100%',
  },
  tableHeader: {
    backgroundColor: colors.background,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textPrimary,
    borderBottom: `2px solid ${colors.border}`,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: colors.textSecondary,
  },
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  noImage: {
    width: '50px',
    height: '50px',
    backgroundColor: colors.background,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: colors.textLight,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  stockBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  actionButton: {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    color: colors.surface,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border}`,
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
    transition: 'opacity 0.2s',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
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
  const existingStyle = document.getElementById('admin-products-scrollbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'admin-products-scrollbar-styles';
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

export default AdminProducts;
