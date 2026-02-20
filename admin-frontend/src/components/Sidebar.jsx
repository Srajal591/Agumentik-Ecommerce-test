import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { colors, spacing } from '../theme/colors';
import { 
  MdDashboard, 
  MdPeople, 
  MdCategory, 
  MdShoppingBag, 
  MdShoppingCart,
  MdChat,
  MdAssignmentReturn,
  MdConfirmationNumber,
  MdLogout
} from 'react-icons/md';

const Sidebar = ({ setIsAuthenticated, isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    const confirmed = window.confirm('Do you want to logout?');
    if (confirmed) {
      authService.logout();
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Super Admin menu items
  const superAdminMenuItems = [
    { path: '/super-admin/dashboard', label: 'Dashboard', icon: MdDashboard },
    { path: '/super-admin/users', label: 'Users', icon: MdPeople },
    { path: '/super-admin/admin-management', label: 'Admin Management', icon: MdPeople },
    { path: '/super-admin/categories', label: 'Categories', icon: MdCategory },
    { path: '/super-admin/products', label: 'Products', icon: MdShoppingBag },
    { path: '/super-admin/orders', label: 'Orders', icon: MdShoppingCart },
    { path: '/super-admin/tickets', label: 'Tickets', icon: MdConfirmationNumber },
    { path: '/super-admin/live-chat', label: 'Live Chat', icon: MdChat },
    { path: '/super-admin/returns', label: 'Returns', icon: MdAssignmentReturn },
  ];

  // Admin menu items (only 4 links)
  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: MdDashboard },
    { path: '/admin/products', label: 'Products', icon: MdShoppingBag },
    { path: '/admin/orders', label: 'Orders', icon: MdShoppingCart },
    { path: '/admin/returns', label: 'Returns', icon: MdAssignmentReturn },
  ];

  // Select menu items based on role
  const menuItems = user?.role === 'super_admin' ? superAdminMenuItems : adminMenuItems;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div style={styles.overlay} onClick={onClose} className="sidebar-overlay" />}
      
      <aside style={styles.sidebar} className={isOpen ? 'sidebar-open' : ''}>
        <div style={styles.sidebarContent}>
          {/* Navigation */}
          <nav style={styles.nav}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
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

          {/* Sidebar Footer */}
          <div style={styles.sidebarFooter}>
            <div style={styles.userCard}>
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
        </div>
      </aside>
    </>
  );
};

const styles = {
  overlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    top: '70px',
    width: '250px',
    height: 'calc(100vh - 70px)',
    backgroundColor: colors.surface,
    borderRight: `1px solid ${colors.border}`,
    overflowY: 'auto',
    zIndex: 999,
    transition: 'transform 0.3s ease',
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  nav: {
    flex: 1,
    padding: spacing.md,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: '4px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: colors.textSecondary,
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  navLinkActive: {
    backgroundColor: colors.primary,
    color: colors.surface,
  },
  navIcon: {
    marginRight: '12px',
    fontSize: '20px',
  },
  sidebarFooter: {
    padding: spacing.md,
    borderTop: `1px solid ${colors.border}`,
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: '8px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '12px',
    color: colors.textSecondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: colors.error,
    color: colors.surface,
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  logoutIcon: {
    fontSize: '18px',
  },
};

// Hover styles
const hoverStyles = `
  aside a:hover:not(.active) {
    background-color: ${colors.background};
    color: ${colors.primary};
  }

  aside button:hover {
    opacity: 0.9;
  }

  /* Scrollbar */
  aside::-webkit-scrollbar {
    width: 6px;
  }

  aside::-webkit-scrollbar-track {
    background: transparent;
  }

  aside::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 3px;
  }

  aside::-webkit-scrollbar-thumb:hover {
    background: ${colors.borderDark};
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    aside {
      transform: translateX(-100%);
    }

    aside.sidebar-open {
      transform: translateX(0);
    }

    .sidebar-overlay {
      display: block !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('sidebar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'sidebar-styles';
  styleSheet.textContent = hoverStyles;
  document.head.appendChild(styleSheet);
}

export default Sidebar;
