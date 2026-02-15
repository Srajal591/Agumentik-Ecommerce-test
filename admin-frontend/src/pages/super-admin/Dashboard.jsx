import { useState, useEffect } from 'react';
import { colors, spacing } from '../../theme/colors';
import { MdPeople, MdCategory, MdShoppingBag, MdShoppingCart, MdAdminPanelSettings } from 'react-icons/md';
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
      // Fetch stats from various endpoints
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
    <div style={styles.container}>
      <h1 style={styles.title}>Super Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome to the Super Admin Panel</p>

      <div style={styles.grid}>
        {statCards.map((card, index) => (
          <div key={index} style={styles.card}>
            <div style={{ ...styles.iconContainer, backgroundColor: card.color + '20' }}>
              <card.icon style={{ ...styles.icon, color: card.color }} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardValue}>{card.value}</h3>
              <p style={styles.cardTitle}>{card.title}</p>
            </div>
          </div>
        ))}
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    padding: spacing.lg,
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
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
};

export default SuperAdminDashboard;
