import React from 'react';
import styles from './SupervisorItem.module.css';

const SupervisorItem = ({ supervisor }) => {
  // Calculate performance rating (for demo purposes)
  const performanceRating = supervisor.reportsResolved > 20 
    ? 'Excellent' 
    : supervisor.reportsResolved > 10 
      ? 'Good' 
      : 'Average';
  
  const performanceColor = performanceRating === 'Excellent' 
    ? 'var(--success)' 
    : performanceRating === 'Good' 
      ? 'var(--primary)' 
      : 'var(--warning)';

  return (
    <div className={styles.supervisorItem}>
      <div className={styles.cell}>
        <div className={styles.avatarContainer}>
          <img 
            src={supervisor.profileImage || 'https://via.placeholder.com/40'} 
            alt={supervisor.username}
            className={styles.avatar}
          />
        </div>
        <div>
          <div className={styles.name}>{supervisor.username}</div>
          <div className={styles.email}>{supervisor.email}</div>
        </div>
      </div>
      <div className={styles.cell}>
        <div className={styles.statValue}>{supervisor.reportsResolved || 0}</div>
        <div className={styles.statLabel}>Reports</div>
      </div>
      <div className={styles.cell}>
        <div className={styles.statValue}>{supervisor.workersCount || 0}</div>
        <div className={styles.statLabel}>Workers</div>
      </div>
      <div className={styles.cell}>
        <span 
          className={styles.performanceBadge}
          style={{ backgroundColor: performanceColor }}
        >
          {performanceRating}
        </span>
      </div>
      <div className={styles.cell}>
        <button className={styles.viewButton}>View Details</button>
      </div>
    </div>
  );
};

export default SupervisorItem;