import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { colors, spacing, shadows, borderRadius } from '../theme/colors';
import { 
  MdDashboard, 
  MdPeople, 
  MdCategory, 
  MdShoppingBag, 
  MdShoppingCart,
  MdConfirmationNumber,
  MdAssignmentReturn,
  MdLogout,
  MdStorefront
} from 'react-icons/md';

const Layout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
    { path: '/users', label: 'Users', icon: MdPeople },
    { path: '/categories', label: 'Categories', icon: MdCategory },
    { path: '/products', label: 'Products', icon: MdShoppingBag },
    { path: '/orders', label: 'Orders', icon: MdShoppingCart },
    { path: '/tickets', label: 'Tickets', icon: MdConfirmationNumber },
    { path: '/returns', label: 'Returns', icon: MdAssignmentReturn },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <MdStorefront style={styles.logoIcon} />
            <div>
              <h2 style={styles.logo}>Fashion Store</h2>
              <p style={styles.logoSubtitle}>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <item.icon style={styles.navIcon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user?.name?.[0] || 'A'}</div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user?.name || 'Admin'}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <MdLogout style={styles.logoutIcon} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: colors.background,
  },
  sidebar: {
    width: '280px',
    backgroundColor: colors.sidebarBg,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    boxShadow: shadows.lg,
  },
  sidebarHeader: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.sidebarHover}`,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    fontSize: '32px',
    color: colors.primaryLight,
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.sidebarText,
    margin: 0,
  },
  logoSubtitle: {
    fontSize: '12px',
    color: colors.textLight,
    margin: '2px 0 0 0',
  },
  nav: {
    flex: 1,
    padding: spacing.md,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    marginBottom: '6px',
    borderRadius: borderRadius.md,
    textDecoration: 'none',
    color: colors.sidebarText,
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  navLinkActive: {
    backgroundColor: colors.primaryLight,
    color: colors.surface,
    boxShadow: shadows.md,
  },
  navIcon: {
    marginRight: '14px',
    fontSize: '22px',
  },
  sidebarFooter: {
    padding: spacing.md,
    borderTop: `1px solid ${colors.sidebarHover}`,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.sidebarHover,
    borderRadius: borderRadius.md,
  },
  userAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    color: colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    flexShrink: 0,
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.sidebarText,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '12px',
    color: colors.textLight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  logoutIcon: {
    fontSize: '18px',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    padding: spacing.lg,
    overflowY: 'auto',
    backgroundColor: colors.background,
  },
};

export default Layout;
