import { authService } from '../api/authService';
import { colors, spacing } from '../theme/colors';
import { MdStorefront, MdNotifications, MdAccountCircle, MdMenu } from 'react-icons/md';

const Navbar = ({ onMenuClick }) => {
  const user = authService.getStoredUser();

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContent}>
        {/* Hamburger Menu (Mobile) */}
        <button onClick={onMenuClick} style={styles.hamburger} className="hamburger-btn">
          <MdMenu size={28} />
        </button>

        {/* Logo */}
        <div style={styles.brand}>
          <MdStorefront style={styles.brandIcon} />
          <span style={styles.brandText}>Fashion Store</span>
        </div>

        {/* Right side */}
        <div style={styles.rightSection}>
          <button style={styles.iconButton}>
            <MdNotifications size={22} />
            <span style={styles.badge}>3</span>
          </button>
          <div style={styles.userInfo}>
            <MdAccountCircle size={32} style={styles.userIcon} />
            <div style={styles.userDetails} className="user-details">
              <div style={styles.userName}>{user?.name || 'Admin'}</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    zIndex: 1000,
  },
  navbarContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: `0 ${spacing.lg}`,
  },
  hamburger: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.textPrimary,
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandIcon: {
    fontSize: '28px',
    color: colors.primary,
  },
  brandText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '16px',
    height: '16px',
    backgroundColor: colors.error,
    color: colors.surface,
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  userIcon: {
    color: colors.primary,
  },
  userDetails: {
    display: 'none',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: '12px',
    color: colors.textSecondary,
  },
};

// Responsive styles
const responsiveStyles = `
  nav button:hover {
    background-color: ${colors.background};
  }

  @media (min-width: 768px) {
    .user-details {
      display: block !important;
    }
  }

  @media (max-width: 768px) {
    .hamburger-btn {
      display: flex !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('navbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'navbar-styles';
  styleSheet.textContent = responsiveStyles;
  document.head.appendChild(styleSheet);
}

export default Navbar;
