// src/components/Dashboard/StatsCard.jsx
import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, description, icon, color, accentColor }) => {
  return (
    <div 
      className={styles.card} 
      style={{ 
        '--card-accent': color,
        '--card-bg': accentColor 
      }}
    >
      <div className={styles.iconContainer} style={{ backgroundColor: color }}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      <p className={styles.description}>{description}</p>
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
};

export default StatsCard;