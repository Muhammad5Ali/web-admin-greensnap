import React, { useState, useEffect } from 'react';
import SupervisorList from '../components/Supervisors/SupervisorList';
import styles from './SupervisorsPage.module.css';
import { fetchSupervisors } from '../services/adminService';
import { COLORS } from '../utils/constants';

const SupervisorsPage = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        const supervisorsData = await fetchSupervisors();
        setSupervisors(supervisorsData);
        calculateStats(supervisorsData);
      } catch (err) {
        setError('Failed to load supervisors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSupervisors();
  }, []);

  const calculateStats = (supervisorsData) => {
    const total = supervisorsData.length;
    const permanentResolved = supervisorsData.reduce(
      (sum, s) => sum + (s.permanentResolvedReports || 0), 
      0
    );
    const workers = supervisorsData.reduce(
      (sum, s) => sum + (s.workersCount || 0), 
      0
    );
    
    setStats({
      total,
      avgPermanentResolved: total > 0 ? Math.round(permanentResolved / total) : 0,
      avgWorkers: total > 0 ? Math.round(workers / total) : 0,
      totalPermanentResolved: permanentResolved,
      totalWorkers: workers
    });
  };
  
  const handleSupervisorAdded = (newSupervisor) => {
    const updatedSupervisors = [...supervisors, {
      ...newSupervisor,
      permanentResolvedReports: 0, // Initialize to 0
      workersCount: 0
    }];
    
    setSupervisors(updatedSupervisors);
    calculateStats(updatedSupervisors);
  };

  const handleSupervisorDeleted = (id) => {
    const deletedSupervisor = supervisors.find(s => s._id === id);
    const updatedSupervisors = supervisors.filter(s => s._id !== id);
    setSupervisors(updatedSupervisors);
    
    if (deletedSupervisor && stats) {
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        avgPermanentResolved: prev.total > 1 
          ? Math.round((prev.avgPermanentResolved * prev.total - 
                       (deletedSupervisor.permanentResolvedReports || 0)) / 
                       (prev.total - 1))
          : 0,
        avgWorkers: prev.total > 1 
          ? Math.round((prev.avgWorkers * prev.total - 
                       (deletedSupervisor.workersCount || 0)) / 
                       (prev.total - 1))
          : 0,
        totalPermanentResolved: prev.totalPermanentResolved - 
                               (deletedSupervisor.permanentResolvedReports || 0),
        totalWorkers: prev.totalWorkers - (deletedSupervisor.workersCount || 0)
      }));
    } else {
      calculateStats(updatedSupervisors);
    }
  };

  const handleReportsAssigned = (supervisorId, count) => {
    setSupervisors(prev => {
      const updated = prev.map(sup => {
        if (sup._id === supervisorId) {
          // Create a new object with updated reports count
          const updatedSup = { 
            ...sup, 
            reportsResolved: (sup.reportsResolved || 0) + count 
          };
          
          // Recalculate performance (simplified version)
          const successRate = updatedSup.reportsResolved > 30 
            ? 95 
            : updatedSup.reportsResolved > 15 
              ? 80 
              : updatedSup.reportsResolved > 5 
                ? 60 
                : 30;
          
          updatedSup.performance = 
            successRate >= 90 ? "Excellent" :
            successRate >= 75 ? "Good" :
            successRate >= 50 ? "Average" : "Needs Improvement";
          
          return updatedSup;
        }
        return sup;
      });
      
      calculateStats(updated);
      return updated;
    });
  };

  // NEW HANDLER FOR PERMANENT RESOLUTIONS
  const handlePermanentResolution = (supervisorId, count) => {
    setSupervisors(prev => {
      const updated = prev.map(sup => 
        sup._id === supervisorId 
          ? { 
              ...sup, 
              permanentResolvedReports: (sup.permanentResolvedReports || 0) + count 
            } 
          : sup
      );
      calculateStats(updated);
      return updated;
    });
  };

  return (
    <div className={styles.supervisorsPage}>
      <div className={styles.header}>
        <div>
          <h1>Supervisors Management</h1>
          <p>Manage and monitor your team of supervisors</p>
        </div>
      </div>
      
      {stats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: COLORS.primaryLight }}>
              <span className="material-icons">people</span>
            </div>
            <div>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total Supervisors</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: COLORS.infoLight }}>
              <span className="material-icons">assignment_turned_in</span>
            </div>
            <div>
              <div className={styles.statValue}>{stats.avgPermanentResolved}</div>
              <div className={styles.statLabel}>Avg. Permanent Reports Resolved</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: COLORS.successLight }}>
              <span className="material-icons">groups</span>
            </div>
            <div>
              <div className={styles.statValue}>{stats.avgWorkers}</div>
              <div className={styles.statLabel}>Avg. Workers Managed</div>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading supervisors...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>{error}</h3>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <SupervisorList 
          supervisors={supervisors} 
          onSupervisorAdded={handleSupervisorAdded}
          onSupervisorDeleted={handleSupervisorDeleted}
          onReportsAssigned={handleReportsAssigned}
          onPermanentResolution={handlePermanentResolution} // Passed new handler
        />
      )}
    </div>
  );
};

export default SupervisorsPage;