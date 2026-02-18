import { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { 
  MdAssignmentReturn, 
  MdVisibility, 
  MdFilterList,
  MdRefresh 
} from 'react-icons/md';
import { getAllReturns, updateReturnStatus } from '../api/returnService';
import ResponsiveTable from '../components/ResponsiveTable';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, [pagination.page, filters]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      // Add filters only if they have values
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.type) {
        params.type = filters.type;
      }
      
      console.log('Fetching returns with params:', params);
      const response = await getAllReturns(params);
      console.log('Full API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      
      if (response && response.success && response.data) {
        console.log('Success! Returns data:', response.data);
        console.log('Number of returns:', response.data.returns?.length);
        console.log('First return item:', response.data.returns?.[0]);
        setReturns(response.data.returns || []);
        setPagination(response.data.pagination || pagination);
      } else {
        console.error('Unexpected response structure:', response);
        console.error('Expected structure: { success: true, data: { returns: [], pagination: {} } }');
        alert('Failed to load returns. Check console for details.');
        setReturns([]);
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      console.error('Error details:', error.response || error.message);
      alert(error.message || 'Failed to fetch returns');
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReturn = (returnItem) => {
    setSelectedReturn(returnItem);
    setShowModal(true);
  };

  const handleUpdateStatus = async (status, adminNotes = '', refundAmount = null, pickupScheduledAt = null) => {
    try {
      setUpdating(true);
      const data = { status };
      if (adminNotes) data.adminNotes = adminNotes;
      if (refundAmount) data.refundAmount = refundAmount;
      if (pickupScheduledAt) data.pickupScheduledAt = pickupScheduledAt;

      await updateReturnStatus(selectedReturn._id, data);
      alert('Return status updated successfully');
      setShowModal(false);
      fetchReturns();
    } catch (error) {
      console.error('Error updating return:', error);
      alert(error.response?.data?.message || 'Failed to update return status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      requested: colors.warning,
      approved: colors.info,
      rejected: colors.error,
      picked_up: colors.primary,
      completed: colors.success,
    };
    return statusColors[status] || colors.textSecondary;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      return: colors.primary,
      refund: colors.success,
      replacement: colors.info,
    };
    return typeColors[type] || colors.textSecondary;
  };

  const columns = [
    {
      header: 'Return #',
      accessor: 'returnNumber',
      render: (value) => (
        <span style={{ fontWeight: '600', color: colors.primary }}>{value}</span>
      ),
    },
    {
      header: 'Order #',
      accessor: 'order',
      render: (value) => value?.orderNumber || 'N/A',
    },
    {
      header: 'Customer',
      accessor: 'user',
      render: (value) => (
        <div>
          <div style={{ fontWeight: '500' }}>{value?.name}</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
            {value?.mobile}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (value) => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: borderRadius.sm,
            backgroundColor: `${getTypeColor(value)}15`,
            color: getTypeColor(value),
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'capitalize',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: borderRadius.sm,
            backgroundColor: `${getStatusColor(value)}15`,
            color: getStatusColor(value),
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'capitalize',
          }}
        >
          {value.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Refund Amount',
      accessor: 'refundAmount',
      render: (value) => `₹${value?.toFixed(2) || '0.00'}`,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString('en-IN'),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => (
        <button
          onClick={() => handleViewReturn(row)}
          style={styles.actionButton}
          title="View Details"
        >
          <MdVisibility size={18} />
        </button>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <MdAssignmentReturn style={{ marginRight: spacing.sm }} />
            Returns & Refunds Management
          </h1>
          <p style={styles.subtitle}>Manage product returns and refund requests</p>
        </div>
        <button onClick={fetchReturns} style={styles.refreshButton}>
          <MdRefresh size={20} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersCard}>
        <div style={styles.filtersHeader}>
          <MdFilterList size={20} />
          <span style={{ marginLeft: spacing.xs }}>Filters</span>
        </div>
        <div style={styles.filtersContent}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="requested">Requested</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="picked_up">Picked Up</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={styles.filterSelect}
            >
              <option value="">All Types</option>
              <option value="return">Return</option>
              <option value="refund">Refund</option>
              <option value="replacement">Replacement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.loading}>Loading returns...</div>
        ) : returns.length === 0 ? (
          <div style={styles.noData}>
            <p>No returns found</p>
            <p style={{ fontSize: '14px', color: colors.textSecondary, marginTop: '8px' }}>
              Returns will appear here once customers submit return requests.
            </p>
            <button 
              onClick={fetchReturns} 
              style={{ 
                marginTop: '16px', 
                padding: '8px 16px', 
                backgroundColor: colors.primary, 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Refresh
            </button>
          </div>
        ) : (
          <ResponsiveTable>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {columns.map((col, index) => (
                    <th key={index} style={styles.th}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {returns.map((returnItem) => (
                  <tr key={returnItem._id} style={styles.tableRow}>
                    {columns.map((col, index) => (
                      <td key={index} style={styles.td}>
                        {col.render 
                          ? col.render(returnItem[col.accessor], returnItem)
                          : returnItem[col.accessor]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Return Details Modal */}
      {showModal && selectedReturn && (
        <ReturnDetailsModal
          returnItem={selectedReturn}
          onClose={() => setShowModal(false)}
          onUpdateStatus={handleUpdateStatus}
          updating={updating}
        />
      )}
    </div>
  );
};

// Return Details Modal Component
const ReturnDetailsModal = ({ returnItem, onClose, onUpdateStatus, updating }) => {
  const [status, setStatus] = useState(returnItem.status);
  const [adminNotes, setAdminNotes] = useState(returnItem.adminNotes || '');
  const [pickupDate, setPickupDate] = useState('');

  const handleSubmit = () => {
    if (status === returnItem.status && !adminNotes) {
      alert('Please change status or add admin notes');
      return;
    }
    onUpdateStatus(status, adminNotes, null, pickupDate || null);
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      requested: ['approved', 'rejected'],
      approved: ['picked_up', 'rejected'],
      picked_up: ['completed'],
      rejected: [],
      completed: [],
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Return Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.modalBody}>
          {/* Return Info */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Return Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Return Number:</span>
                <span style={styles.infoValue}>{returnItem.returnNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Order Number:</span>
                <span style={styles.infoValue}>{returnItem.order?.orderNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Type:</span>
                <span style={styles.infoValue}>{returnItem.type}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Current Status:</span>
                <span style={styles.infoValue}>{returnItem.status}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Refund Amount:</span>
                <span style={styles.infoValue}>₹{returnItem.refundAmount?.toFixed(2)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Created:</span>
                <span style={styles.infoValue}>
                  {new Date(returnItem.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Customer Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{returnItem.user?.name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Mobile:</span>
                <span style={styles.infoValue}>{returnItem.user?.mobile}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{returnItem.user?.email}</span>
              </div>
            </div>
          </div>

          {/* Return Reason */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Return Reason</h3>
            <p style={styles.reasonText}>{returnItem.reason}</p>
          </div>

          {/* Items */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Items</h3>
            {returnItem.items.map((item, index) => (
              <div key={index} style={styles.itemCard}>
                <img
                  src={item.image || item.product?.images?.[0]}
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemMeta}>
                    Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                  </div>
                  <div style={styles.itemPrice}>₹{item.price?.toFixed(2)}</div>
                  <div style={styles.itemReason}>Reason: {item.reason}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pickup Address */}
          {returnItem.pickupAddress && (
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>Pickup Address</h3>
              <p style={styles.addressText}>
                {returnItem.pickupAddress.fullName}<br />
                {returnItem.pickupAddress.mobile}<br />
                {returnItem.pickupAddress.addressLine1}<br />
                {returnItem.pickupAddress.addressLine2 && `${returnItem.pickupAddress.addressLine2}\n`}
                {returnItem.pickupAddress.city}, {returnItem.pickupAddress.state} - {returnItem.pickupAddress.pincode}
              </p>
            </div>
          )}

          {/* Update Status */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Update Status</h3>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.formSelect}
                disabled={getNextStatuses(returnItem.status).length === 0}
              >
                <option value={returnItem.status}>{returnItem.status}</option>
                {getNextStatuses(returnItem.status).map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {status === 'approved' && (
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Pickup Scheduled Date</label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  style={styles.formInput}
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={styles.formTextarea}
                placeholder="Add notes about this return..."
                rows={4}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={updating}
              style={styles.submitButton}
            >
              {updating ? 'Updating...' : 'Update Return'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
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
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  filtersCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    marginBottom: spacing.lg,
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  filtersContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterSelect: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    fontSize: '14px',
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    overflow: 'hidden',
  },
  loading: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  noData: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  actionButton: {
    padding: spacing.sm,
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderTop: `1px solid ${colors.border}`,
  },
  paginationButton: {
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: '14px',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: shadows.lg,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: colors.textSecondary,
    lineHeight: 1,
  },
  modalBody: {
    padding: spacing.lg,
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  infoLabel: {
    fontSize: '12px',
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '14px',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  reasonText: {
    fontSize: '14px',
    color: colors.textPrimary,
    lineHeight: '1.6',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  itemCard: {
    display: 'flex',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: borderRadius.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemMeta: {
    fontSize: '12px',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  itemReason: {
    fontSize: '12px',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  addressText: {
    fontSize: '14px',
    color: colors.textPrimary,
    lineHeight: '1.6',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    whiteSpace: 'pre-line',
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  formSelect: {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    fontSize: '14px',
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  formInput: {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    fontSize: '14px',
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  formTextarea: {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    fontSize: '14px',
    backgroundColor: colors.background,
    color: colors.textPrimary,
    resize: 'vertical',
  },
  submitButton: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: colors.background,
  },
  th: {
    padding: spacing.md,
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textSecondary,
    borderBottom: `2px solid ${colors.border}`,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: colors.background,
    },
  },
  td: {
    padding: spacing.md,
    fontSize: '14px',
    color: colors.textPrimary,
  },
};

export default Returns;
