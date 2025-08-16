// src/components/Attendance/AttendanceRecord.jsx
import React from 'react';
import styles from './AttendanceRecord.module.css';
import { format } from 'date-fns';

const AttendanceRecord = ({ attendance }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'present':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'absent':
        return { backgroundColor: '#ffebee', color: '#c62828' };
      case 'on-leave':
        return { backgroundColor: '#fff8e1', color: '#f9a825' };
      default:
        return {};
    }
  };

  return (
    <div className={styles.record}>
      <div className={styles.date}>
        {format(new Date(attendance.date), 'MMM dd, yyyy')}
      </div>
      <div 
        className={styles.status}
        style={getStatusStyle(attendance.status)}
      >
        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
      </div>
      <div className={styles.tasks}>
        <span className={styles.tasksIcon}>✅</span>
        {attendance.tasksCompleted} tasks
      </div>
      <div className={styles.supervisor}>
        {attendance.supervisor?.username || 'N/A'}
      </div>
    </div>
  );
};

export default AttendanceRecord;