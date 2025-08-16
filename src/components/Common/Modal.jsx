import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ title, onClose, children }) => {
  // Close modal when pressing escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={styles.modalContainer}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>{title}</h2>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          
          <div className={styles.modalContent}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;