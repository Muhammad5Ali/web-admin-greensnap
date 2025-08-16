// src/components/Workers/WorkerForm.jsx
import React, { useState } from 'react';
import styles from './WorkerForm.module.css';

const WorkerForm = ({ 
  worker, 
  supervisors, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: worker?.name || '',
    phone: worker?.phone || '',
    area: worker?.area || '',
    supervisor: worker?.supervisor?._id || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 11 digits';
    }
    
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    // Map supervisor to supervisorId
    onSubmit({
      ...formData,
      supervisorId: formData.supervisor
    });
  }
};

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ''}
            maxLength={15}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? styles.errorInput : ''}
            placeholder="11 digit number"
          />
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Area of Operation</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={errors.area ? styles.errorInput : ''}
            maxLength={20}
          />
          {errors.area && <div className={styles.error}>{errors.area}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Supervisor</label>
          <select
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
          >
            <option value="">Select Supervisor</option>
            {supervisors.map(sup => (
              <option key={sup._id} value={sup._id}>
                {sup.username}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
          >
            {worker ? 'Update Worker' : 'Add Worker'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerForm;