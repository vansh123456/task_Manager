import styles from './TaskFilters.module.css';

/**
 * TaskFilters — search bar, status dropdown, priority dropdown, sort order, and reset action.
 */
function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <section className={styles.filtersContainer} aria-label="Task filters and search">
      <div className={styles.topRow}>
        {/* Search input */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className={styles.searchInput}
            id="task-search-input"
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className={styles.clearSearchBtn}
              aria-label="Clear search query"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.controlsRow}>
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className={styles.filterSelect}
          id="task-filter-status"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className={styles.filterSelect}
          id="task-filter-priority"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.filterSelect}
          id="task-sort-by"
          aria-label="Sort tasks by"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date (Soonest)</option>
          <option value="priority-desc">Priority (High to Low)</option>
          <option value="title-asc">Title (A to Z)</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.resetBtn}
            id="task-reset-filters-btn"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default TaskFilters;
