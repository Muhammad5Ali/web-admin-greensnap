// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftPanel}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            {/* <div className={styles.logo}>GS</div> */}
            <h1 className={styles.heading}>GreenSnap Administration</h1>
          </div>
          <p className={styles.subheading}>
            Manage reports, supervisors, and platform analytics
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureText}>Advanced Analytics</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureText}>Secure Administration</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌿</div>
              <div className={styles.featureText}>Eco-Friendly Solutions</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;