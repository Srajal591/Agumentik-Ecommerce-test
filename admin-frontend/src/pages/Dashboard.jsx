import { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { userService } from '../api/userService';
import { productService } from '../api/productService';
import { colors, spacing, shadows, borderRadius } from '../theme/colors';
import { 
  MdPeople, 
  MdShoppingCart, 
  MdShoppingBag, 
  MdPending,
  MdTrendingUp,
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
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: MdPeople, 
      color: colors.primary,
      bgColor: colors.primary + '15',
      trend: '+12%'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: MdShoppingCart, 
      color: colors.success,
      bgColor: colors.successLight,
      trend: '+8%'
    },
    { 
      label: 'Total Products', 
      value: stats.totalProducts, 
      icon: MdShoppingBag, 
      color: colors.info,
      bgColor: colors.infoLight,
      trend: '+5%'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: MdPending, 
      color: colors.warning,
      bgColor: colors.warningLight,
      trend: '-3%'
    },
  ];

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconContainer, backgroundColor: stat.bgColor }}>
                <stat.icon style={{ ...styles.statIcon, color: stat.color }} />
              </div>
              <div style={styles.trendBadge}>
                <MdTrendingUp style={styles.trendIcon} />
                <span>{stat.trend}</span>
              </div>
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
            <MdVisibility style={styles.viewAllIcon} />
            <span>View All</span>
          </button>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order Number</th>
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
                    <td style={styles.td}>
                      <span style={styles.orderNumber}>{order.orderNumber}</span>
                    </td>
                    <td style={styles.td}>{order.user?.name || order.user?.mobile}</td>
                    <td style={styles.td}>
                      <span style={styles.price}>₹{order.total}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                    <div style={styles.emptyState}>
                      <MdShoppingCart style={styles.emptyIcon} />
                      <p style={styles.emptyText}>No orders yet</p>
                    </div>
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
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '15px',
    color: colors.textSecondary,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: '28px',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: colors.successLight,
    color: colors.success,
    borderRadius: borderRadius.full,
    fontSize: '12px',
    fontWeight: '600',
  },
  trendIcon: {
    fontSize: '14px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: '14px',
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '10px 18px',
    backgroundColor: colors.primary,
    color: colors.surface,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  viewAllIcon: {
    fontSize: '18px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: colors.backgroundDark,
    borderRadius: borderRadius.md,
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: colors.textPrimary,
  },
  orderNumber: {
    fontWeight: '600',
    color: colors.primary,
  },
  price: {
    fontWeight: '600',
    color: colors.textPrimary,
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
    fontSize: '15px',
    color: colors.textSecondary,
  },
};

export default Dashboard;
