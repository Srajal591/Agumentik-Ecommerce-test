import { colors, spacing, borderRadius, shadows } from '../theme/colors';

const ResponsiveTable = ({ children }) => {
  return (
    <div style={styles.tableWrapper}>
      <div style={styles.tableContainer}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    msOverflowStyle: '-ms-autohiding-scrollbar', // IE scrollbar
  },
  tableContainer: {
    minWidth: '800px', // Minimum width before scrolling
  },
};

// Add custom scrollbar styles
const scrollbarStyles = `
  .table-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .table-wrapper::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }

  .table-wrapper::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 4px;
  }

  .table-wrapper::-webkit-scrollbar-thumb:hover {
    background: ${colors.borderDark};
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('responsive-table-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'responsive-table-styles';
    styleSheet.textContent = scrollbarStyles;
    document.head.appendChild(styleSheet);
  }
}

export default ResponsiveTable;
