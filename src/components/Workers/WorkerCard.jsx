// src/components/Workers/WorkerCard.jsx
import React, { useState } from 'react';
import styles from './WorkerCard.module.css';
import { Link } from 'react-router-dom';
import Portal from '../Portal';

const WorkerCard = ({ worker, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(worker._id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarFallback}>
            {worker.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{worker.name}</h3>
          <p className={styles.email}>{worker.phone}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.deleteButton}
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete worker"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
      
      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <span className="material-icons">location_on</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Area</div>
            {/* Added title attribute here */}
            <div 
              className={styles.statValue}
              title={worker.area}  // Tooltip implementation
            >
              {worker.area}
            </div>
          </div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <span className="material-icons">assignment_ind</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Supervisor</div>
            {/* Added title attribute here */}
            <div 
              className={styles.statValue}
              title={worker.supervisor?.username || 'Unassigned'}  // Tooltip implementation
            >
              {worker.supervisor?.username || 'Unassigned'}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <Link 
          to={`/workers/${worker._id}/attendance`}
          className={styles.viewBtn}
        >
          <span className="material-icons">calendar_today</span>
          View Attendance
        </Link>
      </div>
      
      {showDeleteConfirm && (
        <Portal>
          <div className={styles.confirmModalOverlay} onClick={() => setShowDeleteConfirm(false)}>
            <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <p>Are you sure you want to delete {worker.name}?</p>
                <div className={styles.modalActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.deleteConfirmButton}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default WorkerCard;