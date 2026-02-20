import { useState, useEffect } from 'react';
import { colors, spacing } from '../theme/colors';
import { MdAdd, MdBlock, MdCheckCircle } from 'react-icons/md';
import axios from '../api/axios';
import { showSuccess, showError, showConfirmation } from '../utils/toast';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin-management');
      if (response.success) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      showError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post('/admin-management', dataToSend);
      
      if (response.success) {
        showSuccess('Admin created successfully');
        fetchAdmins();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      showError(error.message || 'Failed to create admin');
    }
  };

  const handleToggleBlock = async (adminId, currentStatus) => {
    const action = currentStatus ? 'unblock' : 'block';
    showConfirmation(
      `Are you sure you want to ${action} this admin?`,
      async () => {
        try {
          const response = await axios.patch(`/admin-management/${adminId}/toggle-block`);
          if (response.success) {
            showSuccess(response.message);
            fetchAdmins();
          } else {
            showError('Failed to update admin status');
          }
        } catch (error) {
          console.error('Error toggling admin block:', error);
          showError('Failed to update admin status');
        }
      }
    );
  };

  const handleDelete = async (adminId) => {
    showConfirmation(
      'Are you sure you want to delete this admin?',
      async () => {
        try {
          const response = await axios.delete(`/admin-management/${adminId}`);
          if (response.success) {
            showSuccess('Admin deleted successfully');
            fetchAdmins();
          } else {
            showError('Failed to delete admin');
          }
        } catch (error) {
          console.error('Error deleting admin:', error);
          showError('Failed to delete admin');
        }
      }
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading admins...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Management</h1>
        <button onClick={() => setShowModal(true)} style={styles.addButton}>
          <MdAdd size={20} />
          Add Admin
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Mobile</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} style={styles.tableRow}>
                <td style={styles.td}>{admin.name}</td>
                <td style={styles.td}>{admin.email}</td>
                <td style={styles.td}>{admin.mobile}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: admin.isBlocked ? colors.errorLight : colors.successLight,
                      color: admin.isBlocked ? colors.error : colors.success,
                    }}
                  >
                    {admin.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleToggleBlock(admin._id, admin.isBlocked)}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: admin.isBlocked ? colors.success : colors.warning,
                      }}
                    >
                      {admin.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: colors.error,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div style={styles.emptyState}>
            <p>No admins found. Create your first admin.</p>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add New Admin</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mobile *</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  style={styles.input}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    gap: spacing.sm,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
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
    color: colors.textPrimary,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
  },
  td: {
    padding: spacing.md,
    fontSize: '14px',
    color: colors.textSecondary,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: spacing.xs,
  },
  actionButton: {
    padding: '6px 12px',
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
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
    padding: spacing.md,
  },
  modal: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    padding: '10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: colors.border,
    color: colors.textPrimary,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AdminManagement;
