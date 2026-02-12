import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { colors, spacing, shadows, borderRadius } from '../theme/colors';
import { MdEmail, MdLock, MdLogin, MdStorefront } from 'react-icons/md';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.brandingContent}>
          <div style={styles.logoCircleLarge}>
            <MdStorefront style={styles.logoIconLarge} />
          </div>
          <h1 style={styles.brandTitle}>Fashion Store</h1>
          <p style={styles.brandSubtitle}>Premium E-Commerce Platform</p>
          <div style={styles.brandFeatures}>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Manage Products & Inventory</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Track Orders & Shipments</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Customer Support & Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Sign in to your admin account</p>
          </div>

          {error && (
            <div style={styles.error}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <MdEmail style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fashionstore.com"
                  required
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <MdLock style={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryDark}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <MdLogin style={styles.buttonIcon} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Default Credentials</span>
          </div>

          <div style={styles.credentialsBox}>
            <div style={styles.credentialRow}>
              <MdEmail style={styles.credentialIcon} />
              <div>
                <div style={styles.credentialLabel}>Email</div>
                <div style={styles.credentialValue}>admin@fashionstore.com</div>
              </div>
            </div>
            <div style={styles.credentialRow}>
              <MdLock style={styles.credentialIcon} />
              <div>
                <div style={styles.credentialLabel}>Password</div>
                <div style={styles.credentialValue}>Admin@123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  leftPanel: {
    flex: 1,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  brandingContent: {
    textAlign: 'center',
    zIndex: 1,
    maxWidth: '500px',
  },
  logoCircleLarge: {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  logoIconLarge: {
    fontSize: '64px',
    color: colors.surface,
  },
  brandTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  brandSubtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '48px',
    fontWeight: '400',
  },
  brandFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'flex-start',
    maxWidth: '360px',
    margin: '0 auto',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: colors.surface,
    fontSize: '16px',
    fontWeight: '500',
  },
  featureDot: {
    width: '10px',
    height: '10px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    flexShrink: 0,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    backgroundColor: colors.surface,
  },
  formContainer: {
    width: '100%',
    maxWidth: '460px',
  },
  formHeader: {
    marginBottom: spacing.xl,
  },
  formTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: colors.textSecondary,
  },
  error: {
    backgroundColor: colors.errorLight,
    color: colors.error,
    padding: '16px',
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    fontSize: '14px',
    fontWeight: '500',
    border: `1px solid ${colors.error}`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '4px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '22px',
    color: colors.textSecondary,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 52px',
    border: `2px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.surface,
    padding: '18px',
    borderRadius: borderRadius.md,
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    boxShadow: shadows.md,
    marginTop: spacing.sm,
  },
  buttonIcon: {
    fontSize: '22px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: `${spacing.xl} 0 ${spacing.lg} 0`,
    position: 'relative',
  },
  dividerText: {
    fontSize: '13px',
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    padding: '0 16px',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto',
  },
  credentialsBox: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  credentialRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  credentialIcon: {
    fontSize: '24px',
    color: colors.primary,
    flexShrink: 0,
  },
  credentialLabel: {
    fontSize: '12px',
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: '2px',
  },
  credentialValue: {
    fontSize: '14px',
    color: colors.textPrimary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
};

export default Login;
