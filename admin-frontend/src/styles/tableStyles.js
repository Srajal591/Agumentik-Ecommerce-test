// Reusable Table Styles with Responsive Scrolling
import { colors } from '../theme/colors';

export const responsiveTableStyles = {
  // Table Container with Scroll
  tableContainer: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginTop: '24px',
  },
  
  // Scrollable Wrapper - Both Horizontal and Vertical
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '600px', // Max height for vertical scroll
    position: 'relative',
  },
  
  // Table Base Styles
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px', // Minimum width to trigger horizontal scroll
  },
  
  // Table Header
  tableHeader: {
    backgroundColor: colors.background,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  
  // Table Header Cell
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    borderBottom: `2px solid ${colors.border}`,
    whiteSpace: 'nowrap',
  },
  
  // Table Row
  tableRow: {
    transition: 'background-color 0.2s',
    borderBottom: `1px solid ${colors.border}`,
  },
  
  // Table Data Cell
  td: {
    padding: '16px',
    fontSize: '14px',
    color: colors.textSecondary,
    whiteSpace: 'nowrap',
  },
};

// CSS for hover effects and scrollbar styling
export const tableScrollbarCSS = `
  /* Table Row Hover Effect */
  table tbody tr:hover {
    background-color: ${colors.background};
  }

  /* Custom Scrollbar Styling */
  .tableWrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .tableWrapper::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }

  .tableWrapper::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 4px;
  }

  .tableWrapper::-webkit-scrollbar-thumb:hover {
    background: ${colors.borderDark};
  }

  /* Responsive: Remove min-width on mobile */
  @media (max-width: 768px) {
    table {
      min-width: 600px !important;
    }
  }
`;

// Inject CSS into document
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('table-scrollbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const styleSheet = document.createElement('style');
  styleSheet.id = 'table-scrollbar-styles';
  styleSheet.textContent = tableScrollbarCSS;
  document.head.appendChild(styleSheet);
}

export default responsiveTableStyles;
