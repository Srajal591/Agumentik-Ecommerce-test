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
        <div style={styles.tableWrapper}>
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
};

export default Users;
