import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

/**
 * App shell — renders the sticky navbar and the current page via <Outlet />.
 * The "New Task" button is hidden on the /tasks/new route to avoid redundancy.
 */
function Layout() {
  const { pathname } = useLocation();
  const isOnCreatePage = pathname === '/tasks/new';

  return (
    <>
      <header className={styles.navbar} role="banner">
        <div className={styles.navInner}>
          {/* Brand */}
          <Link to="/" className={styles.brand} aria-label="Cleanomatics home">
            <div className={styles.brandIcon} aria-hidden="true">✓</div>
            <span className={styles.brandName}>
              Clean<span>omatics</span>
            </span>
          </Link>

          {/* Actions */}
          <nav className={styles.navActions} aria-label="Main navigation">
            {!isOnCreatePage && (
              <Link to="/tasks/new" className={styles.newTaskBtn} id="nav-new-task-btn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>New Task</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main} id="main-content">
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Layout;
