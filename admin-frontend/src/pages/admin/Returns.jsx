import { useState, useEffect } from 'react';
import { colors, spacing } from '../../theme/colors';
import axios from '../../api/axios';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchReturns();
  }, [pagination.page]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/returns?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (response.success) {
        setReturns(response.data.returns);
        setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      alert('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: colors.warning,
      approved: colors.success,
      rejected: colors.error,
      processing: colors.info,
      completed: colors.success,
    };
    return statusColors[status] || colors.textSecondary;
  };

  if (loading) {
    return <div style={styles.loading}>Loading returns...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Returns Management</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Return ID</th>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((returnItem) => (
                <tr key={returnItem._id} style={styles.tableRow}>
                  <td style={styles.td}>#{returnItem._id.slice(-8)}</td>
                  <td style={styles.td}>#{returnItem.order?._id?.slice(-8) || 'N/A'}</td>
                  <td style={styles.td}>{returnItem.user?.name || returnItem.user?.mobile || 'N/A'}</td>
                  <td style={styles.td}>
                    <div style={styles.reasonText}>{returnItem.reason || 'No reason provided'}</div>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: getStatusColor(returnItem.status) + '20',
                        color: getStatusColor(returnItem.status),
                      }}
                    >
                      {returnItem.status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(returnItem.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {returns.length === 0 && (
          <div style={styles.emptyState}>
            <p>No returns found.</p>
          </div>
        )}

        {/* Pagination */}
        {returns.length > 0 && (
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.md,
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  tableHeader: {
    backgroundColor: colors.background,
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
  reasonText: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    textTransform: 'capitalize',
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

export default AdminReturns;
