import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ticketService } from '../api/ticketService';
import { colors, spacing, shadows } from '../theme/colors';
import { showSuccess, showError } from '../utils/toast';
import { 
  MdConfirmationNumber, 
  MdFilterList,
  MdSearch,
  MdMessage,
  MdCheckCircle,
  MdHourglassEmpty,
  MdCancel,
  MdPriorityHigh
} from 'react-icons/md';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [pagination.page, filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response.success) {
        setTickets(response.data.tickets);
        setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      showError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await ticketService.updateStatus(ticketId, newStatus);
      if (response.success) {
        showSuccess('Ticket status updated successfully');
        fetchTickets();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showError('Failed to update ticket status');
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await ticketService.getById(ticketId);
      if (response.success) {
        setSelectedTicket(response.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      showError('Failed to fetch ticket details');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await ticketService.addMessage(selectedTicket._id, message);
      if (response.success) {
        setMessage('');
        setSelectedTicket(response.data);
        showSuccess('Message sent successfully');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <MdHourglassEmpty size={16} />;
      case 'in_progress':
        return <MdHourglassEmpty size={16} />;
      case 'resolved':
        return <MdCheckCircle size={16} />;
      case 'closed':
        return <MdCancel size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return colors.info;
      case 'in_progress':
        return colors.warning;
      case 'resolved':
        return colors.success;
      case 'closed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading tickets...</div>;
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
          <h1 style={styles.title}>Tickets Management</h1>
          <p style={styles.subtitle}>Customer support and ticket system</p>
        </div>
      </div>

      {/* Filters */}
      <motion.div 
        style={styles.filters}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div style={styles.selectContainer}>
          <MdFilterList size={20} color={colors.textSecondary} />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div style={styles.selectContainer}>
          <MdFilterList size={20} color={colors.textSecondary} />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="order">Order</option>
            <option value="product">Product</option>
            <option value="payment">Payment</option>
            <option value="return">Return</option>
            <option value="other">Other</option>
          </select>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div 
        style={styles.card}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Ticket #</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <motion.tr 
                  key={ticket._id} 
                  style={styles.tableRow}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: colors.background }}
                >
                  <td style={styles.td}>
                    <span style={styles.ticketNumber}>{ticket.ticketNumber}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {ticket.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={styles.userName}>{ticket.user?.name || 'N/A'}</div>
                        <div style={styles.userMobile}>{ticket.user?.mobile}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{ticket.subject}</td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{ticket.category}</span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.priorityBadge,
                        backgroundColor: getPriorityColor(ticket.priority) + '20',
                        color: getPriorityColor(ticket.priority),
                      }}
                    >
                      {ticket.priority === 'high' && <MdPriorityHigh size={14} />}
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(ticket.status) + '20',
                        color: getStatusColor(ticket.status),
                      }}
                    >
                      {getStatusIcon(ticket.status)}
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <motion.button
                        onClick={() => handleViewTicket(ticket._id)}
                        style={styles.viewButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdMessage size={16} />
                        View
                      </motion.button>
                      {ticket.status !== 'closed' && (
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {tickets.length === 0 && (
          <div style={styles.emptyState}>
            <MdConfirmationNumber size={48} color={colors.textLight} />
            <p>No tickets found.</p>
          </div>
        )}

        {/* Pagination */}
        {tickets.length > 0 && (
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

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <motion.div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Ticket Details</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>×</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.ticketInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Ticket #:</span>
                  <span style={styles.infoValue}>{selectedTicket.ticketNumber}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Subject:</span>
                  <span style={styles.infoValue}>{selectedTicket.subject}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Description:</span>
                  <span style={styles.infoValue}>{selectedTicket.description}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Category:</span>
                  <span style={styles.categoryBadge}>{selectedTicket.category}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Status:</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(selectedTicket.status) + '20',
                      color: getStatusColor(selectedTicket.status),
                    }}
                  >
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div style={styles.messagesSection}>
                <h3 style={styles.messagesTitle}>Messages</h3>
                <div style={styles.messagesList}>
                  {selectedTicket.messages?.map((msg, index) => (
                    <div key={index} style={styles.messageItem}>
                      <div style={styles.messageSender}>
                        {msg.sender?.name} ({msg.sender?.role})
                      </div>
                      <div style={styles.messageText}>{msg.message}</div>
                      <div style={styles.messageTime}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.messageInput}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.textarea}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
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
  filters: {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
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
    minWidth: '1000px',
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
  ticketNumber: {
    fontWeight: '600',
    color: colors.primary,
  },
  userCell: {
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
  userName: {
    fontWeight: '500',
    color: colors.textPrimary,
    fontSize: '14px',
  },
  userMobile: {
    fontSize: '12px',
    color: colors.textSecondary,
  },
  categoryBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: colors.background,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'capitalize',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'capitalize',
  },
  actions: {
    display: 'flex',
    gap: spacing.xs,
    alignItems: 'center',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statusSelect: {
    padding: '6px 10px',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: colors.surface,
  },
  emptyState: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: shadows.xl,
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
    fontWeight: 'bold',
    color: colors.textPrimary,
    margin: 0,
  },
  closeButton: {
    fontSize: '32px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textSecondary,
    lineHeight: 1,
  },
  modalBody: {
    padding: spacing.lg,
  },
  ticketInfo: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: '100px',
  },
  infoValue: {
    color: colors.textSecondary,
    flex: 1,
  },
  messagesSection: {
    marginTop: spacing.lg,
  },
  messagesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  messagesList: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: spacing.md,
  },
  messageItem: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: '8px',
    marginBottom: spacing.sm,
  },
  messageSender: {
    fontSize: '12px',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: '14px',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: '11px',
    color: colors.textSecondary,
  },
  messageInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: spacing.sm,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
};

export default Tickets;
