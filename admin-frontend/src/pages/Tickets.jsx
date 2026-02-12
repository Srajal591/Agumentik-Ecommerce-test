import { colors, spacing } from '../theme/colors';

const Tickets = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tickets Management</h1>
      <div style={styles.card}>
        <p style={styles.text}>Ticket management system coming soon...</p>
        <p style={styles.subtext}>
          This page will allow you to view and manage customer support tickets.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  text: {
    fontSize: '18px',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: '14px',
    color: colors.textGray,
  },
};

export default Tickets;
