import React, { useState } from 'react';
import styles from './SupervisorCard.module.css';
import { COLORS } from '../../utils/constants';
import AssignReportsModal from './AssignReportsModal';
import PerformanceModal from './PerformanceModal';
import Portal from '../Portal';

const SupervisorCard = ({ supervisor, onDelete, onAssign }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false); // New state
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Performance rating with enhanced logic
const getPerformanceData = () => {
  // Always use backend performance rating if available
  if (supervisor.performance) {
    const colorMap = {
      'Excellent': COLORS.success,
      'Good': COLORS.primary,
      'Average': COLORS.warning,
      'Needs Improvement': COLORS.error
    };
    
    const iconMap = {
      'Excellent': '⭐',
      'Good': '👍',
      'Average': '↔️',
      'Needs Improvement': '📉'
    };
    
    return {
      level: supervisor.performance,
      color: colorMap[supervisor.performance] || COLORS.error,
      icon: iconMap[supervisor.performance] || '📉',
      barWidth: '100%'
    };
  }
  
  // Fallback (shouldn't happen if backend is working)
  return {
    level: 'Not Rated',
    color: COLORS.gray,
    icon: '❓',
    barWidth: '0%'
  };
};

  const performance = getPerformanceData();

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    
    try {
      await onDelete(supervisor._id);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err.message || 'Failed to delete supervisor');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarContainer}>
          <img 
            src={supervisor.profileImage || '/default-avatar.png'} 
            alt={supervisor.username}
            className={styles.avatar}
            onError={(e) => e.target.src = '/default-avatar.png'}
          />
          <div className={styles.statusIndicator}></div>
        </div>
        
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{supervisor.username}</h3>
          <p className={styles.email}>{supervisor.email}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete supervisor"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
      
      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: COLORS.primaryLight }}>
            <span className="material-icons">assignment_turned_in</span>
          </div>
          <div>
            <div className={styles.statValue}>{supervisor.permanentResolvedReports || 0}</div>
      <div className={styles.statLabel}>Permanent Resolved</div>
    </div>
  </div>
        
        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: COLORS.infoLight }}>
            <span className="material-icons">groups</span>
          </div>
          <div>
            <div className={styles.statValue}>{supervisor.workersCount || 0}</div>
            <div className={styles.statLabel}>Workers</div>
          </div>
        </div>
      </div>
      
      <div className={styles.performanceSection}>
        <div className={styles.performanceHeader}>
          <span>Performance</span>
          <span className={styles.performanceRating} style={{ color: performance.color }}>
            {performance.icon} {performance.level}
          </span>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ 
              width: performance.barWidth, 
              backgroundColor: performance.color 
            }}
          ></div>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        {/* Updated button for performance modal */}
        <button 
          className={styles.viewBtn}
          onClick={() => setShowPerformanceModal(true)}
        >
          <span className="material-icons">visibility</span>
          View Performance
        </button>
        
        <button 
          className={styles.assignBtn}
          onClick={() => setShowAssignModal(true)}
        >
          <span className="material-icons">assignment_ind</span>
          Assign Task
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (

       <Portal>
         <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <h3>Delete Supervisor?</h3>
            <p>Are you sure you want to delete {supervisor.username}? This action cannot be undone.</p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.confirmActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteButton}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Supervisor'}
              </button>
            </div>
          </div>
        </div>
       </Portal>
      )}

      {/* Assign Reports Modal */}
      {showAssignModal && (
        <AssignReportsModal 
          supervisor={supervisor}
          onClose={() => setShowAssignModal(false)}
          onAssign={onAssign}
        />
      )}

      {/* New Performance Modal */}
      {showPerformanceModal && (
        <PerformanceModal 
          supervisorId={supervisor._id}
          onClose={() => setShowPerformanceModal(false)}
        />
      )}
    </div>
  );
};

export default SupervisorCard;