// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginForm.module.css';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      // setError(result.message || 'Invalid credentials');
         setError(result.message || 'Access denied'); 
    }
    
    setLoading(false);
  };

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.logoContainer}>
          <div className={styles.securityBadge}>
            <FiShield className={styles.shieldIcon} />
          </div>
          <h1 className={styles.title}>
            <span className={styles.green}>Green</span>
            <span className={styles.snap}>Snap</span>
            <span className={styles.admin}> Admin</span>
          </h1>
          <p className={styles.subtitle}>Secure Administration Portal</p>
        </div>

        {error && (
          <motion.div 
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <div className={styles.inputGroup}>
          <FiMail className={styles.icon} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <FiLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button 
            type="button" 
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <motion.button 
          type="submit" 
          disabled={loading} 
          className={styles.submitButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className={styles.buttonLoader}>
              <span className={styles.loaderDot}></span>
              <span className={styles.loaderDot}></span>
              <span className={styles.loaderDot}></span>
            </span>
          ) : (
            'Login to Dashboard'
          )}
        </motion.button>

        <div className={styles.securityInfo}>
          <FiShield className={styles.securityIcon} />
          <span>JWT Based Authentication</span>
        </div>

        <div className={styles.footerNote}>
          <p>GreenSnap Admin Portal v1.0</p>
          <p className={styles.copyright}>© {new Date().getFullYear()} GreenSnap Inc.</p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;