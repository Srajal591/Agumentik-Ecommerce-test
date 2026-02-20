import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { colors, spacing, shadows, borderRadius } from '../theme/colors';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';
import { showSuccess, showError } from '../utils/toast';

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
        showSuccess('Login successful! Welcome back.');
        
        // Get user role and redirect accordingly
        const user = authService.getStoredUser();
        if (user?.role === 'super_admin') {
          navigate('/super-admin/dashboard', { replace: true });
        } else if (user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Full Screen Background Image */}
      <div style={styles.backgroundImage}></div>
      <div style={styles.overlay}></div>

      {/* Left Side - Branding Content */}
      <div style={styles.leftContent} className="leftContent">
        <div style={styles.brandingContent}>
          <img 
            src="/agumentik-ecommerce-logo.png" 
            alt="Fashion Store Logo" 
            style={styles.logo}
          />
          <h1 style={styles.brandTitle}>Fashion Store Admin</h1>
          <p style={styles.brandSubtitle}>Manage your e-commerce business with ease</p>
          <div style={styles.brandFeatures}>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Product & Inventory Management</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Order Tracking & Fulfillment</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureDot}></div>
              <span>Customer Support & Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Floating Login Card */}
      <div style={styles.rightContent} className="rightContent">
        <div style={styles.floatingCard} className="floatingCard">
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
                  placeholder="Enter your email"
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
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, rgba(112, 79, 56, 0.75) 0%, rgba(92, 63, 46, 0.85) 100%)`,
    zIndex: 1,
  },
  leftContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    zIndex: 2,
  },
  brandingContent: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  logo: {
    height: '70px',
    width: 'auto',
    marginBottom: '32px',
    filter: 'brightness(0) invert(1)',
    dropShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  brandTitle: {
    fontSize: '52px',
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: '16px',
    letterSpacing: '-1px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  brandSubtitle: {
    fontSize: '22px',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '48px',
    fontWeight: '400',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  },
  brandFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'flex-start',
    maxWidth: '420px',
    margin: '0 auto',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: colors.surface,
    fontSize: '17px',
    fontWeight: '500',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
  featureDot: {
    width: '12px',
    height: '12px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
  rightContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    zIndex: 2,
  },
  floatingCard: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: colors.surface,
    borderRadius: '24px',
    padding: '48px 48px 64px 48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  formHeader: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '15px',
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
};

// Add CSS for animations and responsive design
const styleSheet = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  button:hover {
    opacity: 0.9;
  }

  @media (max-width: 968px) {
    .leftContent {
      display: none !important;
    }
    .rightContent {
      flex: 1 !important;
      width: 100% !important;
    }
  }

  @media (max-width: 640px) {
    .floatingCard {
      padding: 32px 24px !important;
      border-radius: 16px !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('login-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  const style = document.createElement('style');
  style.id = 'login-styles';
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default Login;
