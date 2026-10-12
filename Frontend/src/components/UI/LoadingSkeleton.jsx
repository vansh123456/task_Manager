import styles from './LoadingSkeleton.module.css';

/**
 * LoadingSkeleton displays animated placeholder cards while tasks are fetching.
 */
function LoadingSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className={`${styles.line} ${styles.badge}`} />
            <div className={`${styles.line} ${styles.badge}`} />
          </div>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.desc1}`} />
          <div className={`${styles.line} ${styles.desc2}`} />
          <div className={styles.footer}>
            <div className={`${styles.line}`} style={{ width: '80px', height: '12px' }} />
            <div className={`${styles.line}`} style={{ width: '60px', height: '26px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
