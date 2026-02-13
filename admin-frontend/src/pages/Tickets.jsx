import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { MdConfirmationNumber, MdConstruction } from 'react-icons/md';

const Tickets = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tickets Management</h1>
        <p style={styles.subtitle}>Customer support and ticket system</p>
      </div>
      <div style={styles.card} className="coming-soon-card">
        <div style={styles.iconContainer}>
          <MdConfirmationNumber style={styles.icon} />
          <MdConstruction style={styles.constructionIcon} />
        </div>
        <p style={styles.text}>Ticket Management System</p>
        <p style={styles.subtext}>
          This page will allow you to view and manage customer support tickets, track issues, and provide timely responses to customer inquiries.
        </p>
        <div style={styles.featureList}>
          <div style={styles.feature}>✓ View all support tickets</div>
          <div style={styles.feature}>✓ Assign tickets to team members</div>
          <div style={styles.feature}>✓ Track ticket status and priority</div>
          <div style={styles.feature}>✓ Respond to customer inquiries</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    animation: 'fadeIn 0.5s ease',
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.border}`,
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  iconContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: '80px',
    color: colors.primary,
  },
  constructionIcon: {
    position: 'absolute',
    bottom: '-10px',
    right: '-10px',
    fontSize: '32px',
    color: colors.warning,
  },
  text: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: '14px',
    color: colors.textSecondary,
    lineHeight: '1.6',
    marginBottom: spacing.lg,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    textAlign: 'left',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  feature: {
    fontSize: '14px',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
};

// Add animations
const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .coming-soon-card {
    animation: fadeIn 0.5s ease;
  }

  @media (max-width: 768px) {
    .coming-soon-card {
      padding: ${spacing.lg};
    }
  }

  @media (max-width: 480px) {
    .coming-soon-card {
      padding: ${spacing.md};
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('tickets-page-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'tickets-page-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}

export default Tickets;
