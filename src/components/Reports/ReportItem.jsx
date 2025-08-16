import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './ReportItem.module.css';
import { COLORS, SHADOWS, TRANSITIONS } from '../../utils/constants';

const ReportItem = ({ report }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': 
        return { 
          color: COLORS.warning, 
          bg: COLORS.warningLight,
          icon: '⏱️'
        };
      case 'in-progress': 
        return { 
          color: COLORS.info, 
          bg: COLORS.infoLight,
          icon: '🛠️'
        };
      case 'resolved': 
        return { 
          color: COLORS.success, 
          bg: COLORS.successLight,
          icon: '✅'
        };
        case 'permanent-resolved': 
       return { 
       color: COLORS.primary, 
       bg: COLORS.primaryLight,
       icon: '🔒'
       };
       case 'rejected': 
      return { 
        color: COLORS.error, 
        bg: COLORS.errorLight,
        icon: '❌'
      };
      case 'out-of-scope': 
      return { 
      color: COLORS.secondary, 
      bg: COLORS.secondaryLight,
      icon: '🚫'
      };
      default: 
        return { 
          color: COLORS.darkGray, 
          bg: COLORS.lightGray,
          icon: '❓'
        };
    }
  };

  const statusConfig = getStatusConfig(report.status);

  return (
    <motion.div 
      className={styles.reportItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5,
        boxShadow: SHADOWS.medium
      }}
    >
      <div className={styles.cell}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{report.title}</div>
          <div className={styles.user}>by {report.user?.username}</div>
        </div>
        <div className={styles.timestamp}>
          {new Date(report.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className={styles.cell}>
        <span className={styles.typeBadge}>
          {report.reportType}
        </span>
      </div>
      
      <div className={styles.cell}>
        <span 
          className={styles.statusBadge}
          style={{ 
            backgroundColor: statusConfig.bg,
            color: statusConfig.color
          }}
        >
          <span className={styles.statusIcon}>{statusConfig.icon}</span>
          {report.status}
        </span>
      </div>
      
      <div className={styles.cell}>
        <Link 
          to={`/reports/${report._id}`} 
          className={styles.viewButton}
        >
          View Details <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ReportItem;