/**
 * NotFoundPage — rendered for any unmatched route.
 */
import { Link } from 'react-router-dom';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    gap: '16px',
  },
  code: {
    fontSize: '5rem',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1,
  },
  heading: { fontSize: '1.5rem', color: 'var(--text-primary)' },
  sub: { color: 'var(--text-muted)', maxWidth: '360px' },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    padding: '10px 20px',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.875rem',
    textDecoration: 'none',
  },
};

function NotFoundPage() {
  return (
    <div style={styles.wrapper} className="animate-fadeIn">
      <div style={styles.code}>404</div>
      <h1 style={styles.heading}>Page not found</h1>
      <p style={styles.sub}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" style={styles.link}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
