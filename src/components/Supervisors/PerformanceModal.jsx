import React, { useState, useEffect } from 'react';
import styles from './PerformanceModal.module.css';
import { fetchSupervisorPerformance } from '../../services/adminService';
import Portal from '../Portal';

const PerformanceModal = ({ supervisorId, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSupervisorPerformance(supervisorId);
        setStats(data);
      } catch (error) {
        console.error('Failed to load performance data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [supervisorId]);

  return (
    <Portal>
        <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Supervisor Performance Report</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading performance data...</p>
            </div>
          ) : stats ? (
            <>
              <div className={styles.statsGrid}>
                <StatCard title="In Progress" value={stats.inProgress} color="#4e73df" />
                <StatCard title="Resolved" value={stats.resolved} color="#1cc88a" />
                <StatCard title="Rejected" value={stats.rejected} color="#e74a3b" />
                <StatCard title="Permanent Resolved" value={stats.permanentResolved} color="#36b9cc" />
                <StatCard title="Out of Scope" value={stats.outOfScope} color="#6f42c1" />
                <StatCard title="Workers Managed" value={stats.workersCount} color="#f6c23e" />
              </div>
              
              <div className={styles.performanceRating}>
                <div className={styles.ratingHeader}>
                  <span>Success Rate:</span>
                  <strong>{stats.successRate}%</strong>
                </div>
                <div className={styles.ratingBar}>
                  <div 
                    className={styles.ratingFill} 
                    style={{ width: `${stats.successRate}%` }}
                  ></div>
                </div>
                <div className={styles.ratingFooter}>
                  <span>Overall Performance Rating:</span>
                  <strong>{stats.performance}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className={styles.error}>Failed to load performance data.</p>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={styles.statCard} style={{ borderTop: `4px solid ${color}` }}>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statTitle}>{title}</div>
  </div>
);

export default PerformanceModal;