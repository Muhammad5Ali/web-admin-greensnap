import React from 'react';
import ReportItem from './ReportItem';
import styles from './ReportList.module.css';
import { motion } from 'framer-motion';

const ReportList = ({ reports }) => {
  return (
    <div className={styles.reportList}>
      <div className={styles.header}>
        <div className={styles.headerCell}>Report Details</div>
        <div className={styles.headerCell}>Type</div>
        <div className={styles.headerCell}>Status</div>
        <div className={styles.headerCell}>Actions</div>
      </div>
      
      <div className={styles.listContainer}>
        {reports.map((report, index) => (
          <ReportItem 
            key={report._id} 
            report={report} 
          />
        ))}
      </div>
    </div>
  );
};

export default ReportList;