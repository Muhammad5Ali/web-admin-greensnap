import React, { useState, useEffect } from 'react';
import styles from './UsersPage.module.css';
import { fetchUsers } from '../services/adminService';
import { FiUser } from 'react-icons/fi';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <p>View and search all registered users</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className="material-icons">search</span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiUser size={48} />
          </div>
          <h3>No users found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className={styles.usersGrid}>
          {filteredUsers.map(user => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.avatarContainer}>
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.username} 
                    className={styles.avatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentNode.innerHTML = 
                        `<div class="${styles.avatarFallback}">${user.username.charAt(0)}</div>`;
                    }}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {user.username.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.username}>{user.username}</h3>
                <p className={styles.joinDate}>
                  Joined: {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;