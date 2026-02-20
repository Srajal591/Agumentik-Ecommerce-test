import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { colors, spacing, shadows } from '../../theme/colors';
import { 
  MdPeople, 
  MdCategory, 
  MdShoppingBag, 
  MdShoppingCart, 
  MdAdminPanelSettings,
  MdAssignment
} from 'react-icons/md';
import axios from '../../api/axios';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, adminsRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/users?role=users&limit=1'),
        axios.get('/users?role=admins&limit=1'),
        axios.get('/categories'),
        axios.get('/products?limit=1'),
        axios.get('/orders?limit=1'),
      ]);

      setStats({
        totalUsers: usersRes.data?.pagination?.total || 0,
        totalAdmins: adminsRes.data?.pagination?.total || 0,
        totalCategories: categoriesRes.data?.length || 0,
        totalProducts: productsRes.data?.pagination?.total || 0,
        totalOrders: ordersRes.data?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: MdPeople, color: colors.primary },
    { title: 'Total Admins', value: stats.totalAdmins, icon: MdAdminPanelSettings, color: colors.info },
    { title: 'Categories', value: stats.totalCategories, icon: MdCategory, color: colors.success },
    { title: 'Products', value: stats.totalProducts, icon: MdShoppingBag, color: colors.warning },
    { title: 'Orders', value: stats.totalOrders, icon: MdShoppingCart, color: colors.error },
  ];

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <motion.div 
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 style={styles.title}>Super Admin Dashboard</h1>
        <p style={styles.subtitle}>Welcome to the Super Admin Panel</p>
      </div>

      <div style={styles.grid}>
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: shadows.md }}
          >
            <div style={{ ...styles.iconContainer, backgroundColor: card.color + '15' }}>
              <card.icon style={{ ...styles.icon, color: card.color }} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardValue}>{card.value}</h3>
              <p style={styles.cardTitle}>{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {[
            { icon: MdPeople, label: 'Manage Users', path: '/users' },
            { icon: MdAdminPanelSettings, label: 'Admin Management', path: '/admin-management' },
            { icon: MdCategory, label: 'Categories', path: '/categories' },
            { icon: MdShoppingBag, label: 'Products', path: '/products' },
            { icon: MdAssignment, label: 'Orders', path: '/orders' },
            { icon: MdShoppingCart, label: 'Returns', path: '/returns' },
          ].map((action, index) => (
            <motion.button
              key={index}
              style={styles.actionButton}
              whileHover={{ scale: 1.02, boxShadow: shadows.sm }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = action.path}
            >
              <action.icon size={22} color={colors.primary} />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
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
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: '16px',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.lg,
    boxShadow: shadows.sm,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '28px',
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    margin: 0,
  },
  cardTitle: {
    fontSize: '14px',
    color: colors.textSecondary,
    margin: 0,
    marginTop: spacing.xs,
  },
  quickActions: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: spacing.md,
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    transition: 'all 0.2s ease',
  },
};

export default SuperAdminDashboard;
