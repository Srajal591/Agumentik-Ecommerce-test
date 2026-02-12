import { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { colors, spacing } from '../theme/colors';

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
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateStatus(orderId, newStatus);
      if (response.success) {
        alert('Order status updated successfully');
        fetchOrders();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Orders Management</h1>

      <div style={styles.card}>
        <div style={styles.table}>
          <table style={styles.tableElement}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={styles.tableRow}>
                  <td style={styles.td}>{order.orderNumber}</td>
                  <td style={styles.td}>{order.user?.name || order.user?.mobile}</td>
                  <td style={styles.td}>{order.items.length}</td>
                  <td style={styles.td}>₹{order.total}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(order.paymentStatus)}>{order.paymentStatus}</span>
                  </td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleViewDetails(order)} style={styles.viewButton}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Order Details - {selectedOrder.orderNumber}</h2>
            
            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Customer Information</h3>
              <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
              <p><strong>Mobile:</strong> {selectedOrder.shippingAddress.mobile}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}</p>
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>Update Status</h3>
              <select
                onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                defaultValue={selectedOrder.orderStatus}
                style={styles.select}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button onClick={() => setShowModal(false)} style={styles.closeButton}>
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
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  };

  const statusColors = {
    pending: { backgroundColor: colors.warning + '20', color: colors.warning },
    confirmed: { backgroundColor: colors.info + '20', color: colors.info },
    shipped: { backgroundColor: colors.primary + '20', color: colors.primary },
    delivered: { backgroundColor: colors.success + '20', color: colors.success },
    cancelled: { backgroundColor: colors.error + '20', color: colors.error },
    completed: { backgroundColor: colors.success + '20', color: colors.success },
    failed: { backgroundColor: colors.error + '20', color: colors.error },
  };

  return { ...baseStyle, ...statusColors[status] };
};

const styles = {
  container: {
    maxWidth: '1400px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: colors.textGray,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.md,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    overflowX: 'auto',
  },
  tableElement: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: colors.background,
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textDark,
    borderBottom: `2px solid ${colors.border}`,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: colors.textDark,
  },
  viewButton: {
    padding: '6px 16px',
    backgroundColor: colors.primary,
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
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border}`,
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
    color: colors.textGray,
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
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  modalSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
  },
  closeButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Orders;
