import { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { userService } from '../api/userService';
import { productService } from '../api/productService';
import { colors, spacing } from '../theme/colors';
import { 
  MdPeople, 
  MdShoppingCart, 
  MdShoppingBag, 
  MdPending,
  MdVisibility
} from 'react-icons/md';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        userService.getAll({ limit: 1 }),
        orderService.getAll({ limit: 5 }),
        productService.getAll({ limit: 1 }),
      ]);

      if (usersRes.success) {
        setStats((prev) => ({ ...prev, totalUsers: usersRes.data.pagination.total }));
      }

      if (ordersRes.success) {
        setStats((prev) => ({
          ...prev,
          totalOrders: ordersRes.data.pagination.total,
          pendingOrders: ordersRes.data.orders.filter((o) => o.orderStatus === 'pending').length,
        }));
        setRecentOrders(ordersRes.data.orders);
      }

      if (productsRes.success) {
        setStats((prev) => ({ ...prev, totalProducts: productsRes.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: MdPeople, color: colors.primary },
    { label: 'Total Orders', value: stats.totalOrders, icon: MdShoppingCart, color: colors.success },
    { label: 'Total Products', value: stats.totalProducts, icon: MdShoppingBag, color: colors.info },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: MdPending, color: colors.warning },
  ];

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20' }}>
              <stat.icon style={{ color: stat.color, fontSize: '28px' }} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          <button style={styles.viewAllButton}>
            <MdVisibility style={{ marginRight: '6px' }} />
            View All
          </button>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} style={styles.tableRow}>
                    <td style={styles.td}>{order.orderNumber}</td>
                    <td style={styles.td}>{order.user?.name || order.user?.mobile}</td>
                    <td style={styles.td}>₹{order.total}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</span>
                    </td>
                    <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                    <MdShoppingCart style={{ fontSize: '48px', color: colors.textLight }} />
                    <p>No orders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const statusColors = {
    pending: { backgroundColor: colors.warningLight, color: colors.warning },
    confirmed: { backgroundColor: colors.infoLight, color: colors.info },
    shipped: { backgroundColor: colors.primary + '20', color: colors.primary },
    delivered: { backgroundColor: colors.successLight, color: colors.success },
    cancelled: { backgroundColor: colors.errorLight, color: colors.error },
  };

  return {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
    display: 'inline-block',
    ...statusColors[status],
  };
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
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 0,
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
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
};

export default Dashboard;
