// src/pages/WorkerAttendancePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AttendanceRecord from '../components/Workers/AttendanceRecord';
import { fetchWorkerAttendance } from '../services/adminService';
import styles from './WorkerAttendancePage.module.css';
import { format } from 'date-fns';

const WorkerAttendancePage = () => {
  const { workerId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [worker, setWorker] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const attendanceData = await fetchWorkerAttendance(workerId, dateFilter);
        setAttendance(attendanceData.attendance);
        setWorker(attendanceData.worker);
      } catch (err) {
        setError('Failed to load attendance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [workerId, dateFilter]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    // Filtering will be triggered automatically by the useEffect
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>{error}</h3>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.attendancePage}>
      <div className={styles.header}>
        <div>
          <h1>Attendance Records</h1>
          <p>for {worker?.name || 'Worker'}</p>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {attendance.length}
          </div>
          <div className={styles.summaryLabel}>Records</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {attendance.filter(a => a.status === 'present').length}
          </div>
          <div className={styles.summaryLabel}>Present</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryValue}>
            {attendance.reduce((sum, a) => sum + a.tasksCompleted, 0)}
          </div>
          <div className={styles.summaryLabel}>Tasks Completed</div>
        </div>
      </div>

      <div className={styles.filters}>
        <form onSubmit={handleDateSubmit} className={styles.dateFilter}>
          <div className={styles.formGroup}>
            <label>From</label>
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>To</label>
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateChange}
            />
          </div>
          <button type="submit" className={styles.filterButton}>
            Apply Filter
          </button>
        </form>
      </div>

      <div className={styles.attendanceList}>
        <div className={styles.listHeader}>
          <div className={styles.headerCell}>Date</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Tasks</div>
          <div className={styles.headerCell}>Supervisor</div>
        </div>
        
        {attendance.length === 0 ? (
          <div className={styles.emptyList}>
            No attendance records found for the selected period
          </div>
        ) : (
          attendance.map(record => (
            <AttendanceRecord 
              key={record._id} 
              attendance={record} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerAttendancePage;