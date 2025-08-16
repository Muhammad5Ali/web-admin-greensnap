import React, { useState, useEffect } from 'react';
import styles from './AssignReportsModal.module.css';
import { fetchReports } from '../../services/adminService';
import Portal from '../Portal';

const AssignReportsModal = ({ 
  supervisor, 
  onClose, 
  onAssign 
}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState([]);
  const [assignmentMessage, setAssignmentMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPendingReports = async () => {
      try {
        const reportsData = await fetchReports('pending', 1, 100, '');
        setReports(reportsData.reports);
      } catch (err) {
        setError('Failed to load pending reports.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPendingReports();
  }, []);

  const toggleReportSelection = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleAssign = async () => {
    if (selectedReports.length === 0) {
      setError('Please select at least one report');
      return;
    }

    try {
      await onAssign(supervisor._id, selectedReports, assignmentMessage);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign reports');
    }
  };

  return (
   <Portal>
     <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Assign Reports to {supervisor.username}</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Assignment Message (Optional)</label>
            <textarea
              value={assignmentMessage}
              onChange={(e) => setAssignmentMessage(e.target.value)}
              placeholder="Add instructions for the supervisor"
              rows="3"
            />
          </div>

          <div className={styles.sectionTitle}>
            Select Reports to Assign
          </div>

          {loading ? (
            <div className={styles.loading}>
              <p>Loading pending reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <p>No pending reports available.</p>
          ) : (
            <div className={styles.reportsList}>
              {reports.map(report => (
                <div 
                  key={report._id} 
                  className={`${styles.reportItem} ${selectedReports.includes(report._id) ? styles.selected : ''}`}
                  onClick={() => toggleReportSelection(report._id)}
                >
                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report._id)}
                      onChange={() => toggleReportSelection(report._id)}
                    />
                  </div>
                  <div className={styles.reportInfo}>
                    <h4>{report.title}</h4>
                    <p className={styles.address}>{report.address}</p>
                    <p className={styles.date}>
                      Reported: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.assignButton}
            onClick={handleAssign}
            disabled={selectedReports.length === 0}
          >
            Assign Selected Reports
          </button>
        </div>
      </div>
    </div>
   </Portal>
  );
};

export default AssignReportsModal;