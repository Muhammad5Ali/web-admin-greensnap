// src/pages/WorkersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WorkerCard from '../components/Workers/WorkerCard';
import WorkerForm from '../components/Workers/WorkerForm';
import { 
  fetchWorkers, 
  createWorker, 
  updateWorker, 
  deleteWorker 
} from '../services/adminService';
import { fetchSupervisors } from '../services/adminService';
import styles from './WorkersPage.module.css';

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [workersData, supervisorsData] = await Promise.all([
          fetchWorkers(),
          fetchSupervisors()
        ]);
        
        setWorkers(workersData.workers);
        setSupervisors(supervisorsData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredWorkers = workers.filter(worker => {
    const searchLower = searchTerm.toLowerCase();
    return (
      worker.name.toLowerCase().includes(searchLower) ||
      worker.phone.toLowerCase().includes(searchLower) ||
      worker.area.toLowerCase().includes(searchLower) ||
      (worker.supervisor?.username?.toLowerCase().includes(searchLower) || '')
    );
  });

  const handleAddWorker = () => {
    setCurrentWorker(null);
    setIsFormOpen(true);
  };

//   const handleEditWorker = (worker) => {
//     setCurrentWorker(worker);
//     setIsFormOpen(true);
//   };

  const handleDeleteWorker = async (id) => {
    try {
      await deleteWorker(id);
      setWorkers(workers.filter(worker => worker._id !== id));
    } catch (err) {
      setError('Failed to delete worker');
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Create payload with supervisorId
      const payload = {
        name: formData.name,
        phone: formData.phone,
        area: formData.area,
        supervisorId: formData.supervisorId
      };

      if (currentWorker) {
        const updatedWorker = await updateWorker(currentWorker._id, payload);
        setWorkers(workers.map(w => 
          w._id === currentWorker._id ? { ...w, ...updatedWorker.worker } : w
        ));
      } else {
        const newWorker = await createWorker(payload);
        setWorkers([...workers, newWorker.worker]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError(currentWorker ? 'Failed to update worker' : 'Failed to create worker');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading workers...</p>
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
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.workersPage}>
      <div className={styles.header}>
        <div>
          <h1>Workers Management</h1>
          <p>Manage all field workers and their assignments</p>
        </div>
        <button 
          className={styles.addButton}
          onClick={handleAddWorker}
        >
          <span className="material-icons">person_add</span>
          Add Worker
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className="material-icons">search</span>
        </div>
      </div>

      {filteredWorkers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👷</div>
          <h3>No workers found</h3>
          <p>Try adding a new worker or adjusting your search</p>
          <button 
            className={styles.addButton}
            onClick={handleAddWorker}
          >
            Add New Worker
          </button>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {filteredWorkers.map(worker => (
            <WorkerCard 
              key={worker._id}
              worker={worker}
              onDelete={handleDeleteWorker}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{currentWorker ? 'Edit Worker' : 'Add New Worker'}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsFormOpen(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <WorkerForm 
              worker={currentWorker}
              supervisors={supervisors}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;