import { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import ResponsiveTable from '../components/ResponsiveTable';
import { MdVisibility, MdClose, MdShoppingCart } from 'react-icons/md';
import { showSuccess, showError } from '../utils/toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.success) {
        setOrders(response.data.orders);
        setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateStatus(orderId, newStatus);
      if (response.success) {
        showSuccess('Order status updated successfully');
        fetchOrders();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Orders Management</h1>
        <p style={styles.subtitle}>Track and manage customer orders</p>
      </div>

      <div style={styles.card} className="orders-card">
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>All Orders</h2>
          <div style={styles.stats}>
            <span style={styles.statBadge}>Total: {pagination.total}</span>
          </div>
        </div>

        <ResponsiveTable>
          <table style={styles.table} className="table-wrapper">
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Payment Method</th>
                <th style={styles.th}>Payment Status</th>
                <th style={styles.th}>Order Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} style={styles.tableRow} className="table-row">
                    <td style={styles.td}>
                      <span style={styles.orderNumber}>{order.orderNumber}</span>
                    </td>
                    <td style={styles.td}>{order.user?.name || order.user?.mobile}</td>
                    <td style={styles.td}>{order.items.length}</td>
                    <td style={styles.td}>
                      <span style={styles.price}>₹{order.total}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: order.paymentMethod === 'razorpay' ? colors.primaryLight : colors.backgroundDark,
                        color: order.paymentMethod === 'razorpay' ? colors.primary : colors.textSecondary,
                      }}>
                        {order.paymentMethod === 'razorpay' ? '💳 Online' : '💵 COD'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(order.paymentStatus)}>{order.paymentStatus}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</span>
                    </td>
                    <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleViewDetails(order)} style={styles.viewButton} className="view-btn">
                        <MdVisibility style={styles.btnIcon} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                    <div style={styles.emptyState}>
                      <MdShoppingCart style={styles.emptyIcon} />
                      <p style={styles.emptyText}>No orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ResponsiveTable>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div style={styles.pagination}>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              style={{
                ...styles.paginationButton,
                opacity: pagination.page === 1 ? 0.5 : 1,
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              }}
              className="pagination-btn"
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              style={{
                ...styles.paginationButton,
                opacity: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 0.5 : 1,
                cursor: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'not-allowed' : 'pointer',
              }}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)} className="modal-overlay">
          <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="modal-content">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Details - {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeButton} className="close-btn">
                <MdClose size={24} />
              </button>
            </div>
            
            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Customer Information</h3>
              <p style={styles.infoText}><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
              <p style={styles.infoText}><strong>Mobile:</strong> {selectedOrder.shippingAddress.mobile}</p>
              <p style={styles.infoText}><strong>Address:</strong> {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}</p>
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Payment Information</h3>
              <p style={styles.infoText}>
                <strong>Payment Method:</strong> 
                <span style={{
                  marginLeft: '8px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: selectedOrder.paymentMethod === 'razorpay' ? colors.primaryLight : colors.backgroundDark,
                  color: selectedOrder.paymentMethod === 'razorpay' ? colors.primary : colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}>
                  {selectedOrder.paymentMethod === 'razorpay' ? '💳 Online Payment' : '💵 Cash on Delivery'}
                </span>
              </p>
              <p style={styles.infoText}>
                <strong>Payment Status:</strong> 
                <span style={{
                  marginLeft: '8px',
                  ...getStatusStyle(selectedOrder.paymentStatus)
                }}>
                  {selectedOrder.paymentStatus}
                </span>
              </p>
              {selectedOrder.paymentId && (
                <p style={styles.infoText}>
                  <strong>Payment ID:</strong> 
                  <span style={{
                    marginLeft: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: colors.textSecondary,
                    backgroundColor: colors.background,
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}>
                    {selectedOrder.paymentId}
                  </span>
                </p>
              )}
              <p style={styles.infoText}>
                <strong>Order Total:</strong> 
                <span style={{
                  marginLeft: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: colors.primary,
                }}>
                  ₹{selectedOrder.total}
                </span>
              </p>
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <span>{item.name} x {item.quantity}</span>
                  <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Update Status</h3>
              <select
                onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                defaultValue={selectedOrder.orderStatus}
                style={styles.select}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button onClick={() => setShowModal(false)} style={styles.closeModalButton} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '6px 14px',
    borderRadius: borderRadius.full,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
    display: 'inline-block',
  };

  const statusColors = {
    pending: { backgroundColor: colors.warningLight, color: colors.warning },
    confirmed: { backgroundColor: colors.infoLight, color: colors.info },
    shipped: { backgroundColor: colors.primary + '20', color: colors.primary },
    delivered: { backgroundColor: colors.successLight, color: colors.success },
    cancelled: { backgroundColor: colors.errorLight, color: colors.error },
    completed: { backgroundColor: colors.successLight, color: colors.success },
    failed: { backgroundColor: colors.errorLight, color: colors.error },
  };

  return { ...baseStyle, ...statusColors[status] };
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    animation: 'fadeIn 0.5s ease',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    gap: spacing.md,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${colors.border}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    marginBottom: spacing.lg,
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border}`,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stats: {
    display: 'flex',
    gap: spacing.sm,
  },
  statBadge: {
    padding: '6px 12px',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: colors.background,
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textPrimary,
    borderBottom: `2px solid ${colors.border}`,
    whiteSpace: 'nowrap',
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: colors.textSecondary,
  },
  orderNumber: {
    fontWeight: '600',
    color: colors.primary,
  },
  price: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  btnIcon: {
    fontSize: '16px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    fontSize: '48px',
    color: colors.textLight,
  },
  emptyText: {
    fontSize: '16px',
    color: colors.textSecondary,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
    flexWrap: 'wrap',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    padding: spacing.md,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: shadows.xl,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    fontSize: '14px',
    color: colors.textSecondary,
    borderBottom: `1px solid ${colors.border}`,
  },
  itemPrice: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  select: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    fontSize: '14px',
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  closeModalButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: shadows.sm,
  },
};

// Add animations and responsive styles
const responsiveStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .orders-card {
    animation: fadeIn 0.5s ease;
  }

  .table-row:hover {
    background-color: ${colors.background};
  }

  .view-btn:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  .view-btn:active {
    transform: translateY(0);
  }

  .pagination-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  .pagination-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .modal-overlay {
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    animation: slideUp 0.3s ease;
  }

  .close-btn:hover {
    background-color: ${colors.background};
    color: ${colors.textPrimary};
  }

  .status-select:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }

  .close-modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  .close-modal-btn:active {
    transform: translateY(0);
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .orders-card {
      padding: ${spacing.md};
      border-radius: ${borderRadius.md};
    }
  }

  @media (max-width: 480px) {
    .orders-card {
      padding: ${spacing.sm};
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('orders-page-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'orders-page-styles';
    styleSheet.textContent = responsiveStyles;
    document.head.appendChild(styleSheet);
  }
}

export default Orders;
