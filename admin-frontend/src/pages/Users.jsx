import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../api/userService';
import { colors, spacing, shadows } from '../theme/colors';
import { showSuccess, showError, showConfirmation } from '../utils/toast';
import { 
  MdPeople, 
  MdAdminPanelSettings, 
  MdBlock, 
  MdCheckCircle
} from 'react-icons/md';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [roleFilter, setRoleFilter] = useState('users'); // 'users' or 'admins'

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        role: roleFilter,
      });

      if (response.success) {
        setUsers(response.data.users);
        setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    showConfirmation(
      'Are you sure you want to toggle block status for this user?',
      async () => {
        try {
          const response = await userService.toggleBlock(userId);
          if (response.success) {
            fetchUsers();
            showSuccess('User status updated successfully');
          } else {
            showError('Failed to update user status');
          }
        } catch (error) {
          console.error('Error toggling user block:', error);
          showError(error.message || 'Failed to update user status');
        }
      }
    );
  };

  const handleRoleFilterChange = (filter) => {
    setRoleFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
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
          <h1 style={styles.title}>Users Management</h1>
          <p style={styles.subtitle}>Manage all users and administrators</p>
        </div>
        
        <div style={styles.filterButtons}>
          <motion.button
            onClick={() => handleRoleFilterChange('users')}
            style={{
              ...styles.filterButton,
              ...(roleFilter === 'users' ? styles.filterButtonActive : {}),
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdPeople size={20} />
            Users
          </motion.button>
          <motion.button
            onClick={() => handleRoleFilterChange('admins')}
            style={{
              ...styles.filterButton,
              ...(roleFilter === 'admins' ? styles.filterButtonActive : {}),
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdAdminPanelSettings size={20} />
            Admins
          </motion.button>
        </div>
      </div>

      <motion.div 
        style={styles.card}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Desktop/Tablet Table View */}
        <div style={styles.tableWrapper} className="tableWrapper">
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr 
                  key={user._id} 
                  style={styles.tableRow}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: colors.background }}
                >
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span style={styles.nameText}>{user.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{user.mobile}</td>
                  <td style={styles.td}>{user.email || 'N/A'}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.roleBadge,
                        backgroundColor: user.role === 'super_admin' 
                          ? colors.primary 
                          : user.role === 'admin' 
                          ? colors.info 
                          : colors.background,
                        color: user.role === 'super_admin' || user.role === 'admin'
                          ? colors.surface
                          : colors.textPrimary,
                      }}
                    >
                      {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: user.isBlocked ? colors.errorLight : colors.successLight,
                        color: user.isBlocked ? colors.error : colors.success,
                      }}
                    >
                      {user.isBlocked ? <><MdBlock size={14} /> Blocked</> : <><MdCheckCircle size={14} /> Active</>}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {user.role !== 'super_admin' && (
                      <motion.button
                        onClick={() => handleToggleBlock(user._id)}
                        style={{
                          ...styles.button,
                          backgroundColor: user.isBlocked ? colors.success : colors.error,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </motion.button>
                    )}
                    {user.role === 'super_admin' && (
                      <span style={styles.protectedText}>Protected</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-card-view" style={styles.mobileCardView}>
          {users.map((user) => (
            <motion.div
              key={user._id}
              style={styles.mobileCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={styles.mobileCardHeader}>
                <div style={styles.nameCell}>
                  <div style={styles.avatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={styles.nameText}>{user.name || 'N/A'}</div>
                    <div style={styles.mobileSubtext}>{user.mobile}</div>
                  </div>
                </div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: user.isBlocked ? colors.errorLight : colors.successLight,
                    color: user.isBlocked ? colors.error : colors.success,
                  }}
                >
                  {user.isBlocked ? <><MdBlock size={14} /> Blocked</> : <><MdCheckCircle size={14} /> Active</>}
                </span>
              </div>
              
              <div style={styles.mobileCardBody}>
                <div style={styles.mobileRow}>
                  <span style={styles.mobileLabel}>Email:</span>
                  <span style={styles.mobileValue}>{user.email || 'N/A'}</span>
                </div>
                <div style={styles.mobileRow}>
                  <span style={styles.mobileLabel}>Role:</span>
                  <span
                    style={{
                      ...styles.roleBadge,
                      backgroundColor: user.role === 'super_admin' 
                        ? colors.primary 
                        : user.role === 'admin' 
                        ? colors.info 
                        : colors.background,
                      color: user.role === 'super_admin' || user.role === 'admin'
                        ? colors.surface
                        : colors.textPrimary,
                    }}
                  >
                    {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <div style={styles.mobileRow}>
                  <span style={styles.mobileLabel}>Joined:</span>
                  <span style={styles.mobileValue}>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {user.role !== 'super_admin' && (
                <motion.button
                  onClick={() => handleToggleBlock(user._id)}
                  style={{
                    ...styles.mobileButton,
                    backgroundColor: user.isBlocked ? colors.success : colors.error,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.isBlocked ? 'Unblock User' : 'Block User'}
                </motion.button>
              )}
              {user.role === 'super_admin' && (
                <div style={styles.mobileProtected}>Protected Account</div>
              )}
            </motion.div>
          ))}
        </div>

        {users.length === 0 && (
          <div style={styles.emptyState}>
            <p>No {roleFilter === 'users' ? 'users' : 'admins'} found.</p>
          </div>
        )}

        {users.length > 0 && (
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
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
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
        )}
      </motion.div>
    </motion.div>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: '14px',
    color: colors.textSecondary,
    margin: 0,
  },
  filterButtons: {
    display: 'flex',
    gap: spacing.xs,
    backgroundColor: colors.background,
    padding: '4px',
    borderRadius: '8px',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.md,
    boxShadow: shadows.sm,
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
    padding: '14px 12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textPrimary,
    borderBottom: `2px solid ${colors.border}`,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '14px 12px',
    fontSize: '14px',
    color: colors.textSecondary,
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  nameText: {
    fontWeight: '500',
    color: colors.textPrimary,
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  roleBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  button: {
    padding: '6px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.surface,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  protectedText: {
    fontSize: '12px',
    color: colors.textLight,
    fontStyle: 'italic',
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
    transition: 'all 0.2s',
  },
  paginationInfo: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  // Mobile Card Styles
  mobileCardView: {
    display: 'none',
    gap: spacing.md,
  },
  mobileCard: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  mobileCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottom: `1px solid ${colors.border}`,
  },
  mobileCardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  mobileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mobileLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  mobileValue: {
    fontSize: '13px',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  mobileSubtext: {
    fontSize: '12px',
    color: colors.textSecondary,
    marginTop: '2px',
  },
  mobileButton: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.surface,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mobileProtected: {
    width: '100%',
    padding: '10px',
    textAlign: 'center',
    fontSize: '13px',
    color: colors.textLight,
    fontStyle: 'italic',
    backgroundColor: colors.background,
    borderRadius: '8px',
  },
};

// Add scrollbar styling and responsive card view
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

  .tableWrapper table tbody tr:hover {
    background-color: ${colors.background};
  }

  /* Desktop and Tablet - Table View */
  @media (min-width: 769px) {
    .mobile-card-view {
      display: none !important;
    }
    .tableWrapper {
      display: block !important;
      max-height: 600px;
    }
  }

  /* Mobile - Card View */
  @media (max-width: 768px) {
    .tableWrapper {
      display: none !important;
    }
    .mobile-card-view {
      display: block !important;
      max-height: 600px;
      overflow-y: auto;
    }
  }

  @media (max-width: 480px) {
    .mobile-card-view {
      max-height: 500px;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('users-scrollbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'users-scrollbar-styles';
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

export default Users;
