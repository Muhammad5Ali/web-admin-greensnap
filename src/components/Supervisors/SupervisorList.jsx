import React, { useState } from 'react';
import SupervisorCard from './SupervisorCard';
import styles from './SupervisorList.module.css';
import { createSupervisor, deleteSupervisor, assignReportsToSupervisor } from '../../services/adminService';

const SupervisorList = ({ supervisors, onSupervisorAdded, onSupervisorDeleted, onReportsAssigned }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = supervisor.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (performanceFilter === 'all') return matchesSearch;
    
    // Use the actual performance rating from backend
    const rating = supervisor.performance;
    
    // Map filter values to backend ratings
    switch(performanceFilter) {
      case 'excellent': return matchesSearch && rating === 'Excellent';
      case 'good': return matchesSearch && rating === 'Good';
      case 'average': return matchesSearch && rating === 'Average';
      case 'needs-improvement': return matchesSearch && rating === 'Needs Improvement';
      default: return matchesSearch;
    }
  });
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await createSupervisor(formData);
      onSupervisorAdded(response.user);
      setIsModalOpen(false);
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create supervisor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupervisor = async (id) => {
    try {
      await deleteSupervisor(id);
      onSupervisorDeleted(id);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // New: Handle report assignment
  const handleAssignReports = async (supervisorId, reportIds, assignmentMessage) => {
    try {
      await assignReportsToSupervisor(supervisorId, reportIds, assignmentMessage);
      if (onReportsAssigned) {
        onReportsAssigned(supervisorId, reportIds.length);
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search supervisors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Performance:</label>
          <select 
            value={performanceFilter} 
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="needs-improvement">Needs Improvement</option>
          </select>
        </div>
        
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-icons">person_add</span>
          Add Supervisor
        </button>
      </div>
      
      {filteredSupervisors.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👤</div>
          <h3>No supervisors found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSupervisors.map(supervisor => (
            <SupervisorCard 
              key={supervisor._id} 
              supervisor={supervisor}
              onDelete={handleDeleteSupervisor}
              onAssign={handleAssignReports}
            />
          ))}
        </div>
      )}
      
      {/* Add Supervisor Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add New Supervisor</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  disabled={loading}
                />
                <p className={styles.passwordHint}>
                  Must be at least 8 characters
                </p>
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner}></span> Creating...
                    </>
                  ) : 'Create Supervisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorList;