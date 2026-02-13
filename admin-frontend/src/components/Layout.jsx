import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { colors, spacing } from '../theme/colors';

const Layout = ({ setIsAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar 
        setIsAuthenticated={setIsAuthenticated} 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  main: {
    marginLeft: '250px',
    marginTop: '70px',
    flex: 1,
    minHeight: 'calc(100vh - 70px)',
  },
  content: {
    padding: spacing.lg,
  },
};

// Responsive styles
const responsiveStyles = `
  @media (max-width: 768px) {
    main {
      margin-left: 0 !important;
      padding: ${spacing.md} !important;
    }
  }

  @media (max-width: 480px) {
    main {
      padding: ${spacing.sm} !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('layout-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'layout-styles';
  styleSheet.textContent = responsiveStyles;
  document.head.appendChild(styleSheet);
}

export default Layout;
