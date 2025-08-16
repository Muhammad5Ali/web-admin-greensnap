// src/components/Auth/LogoutButton.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button 
      onClick={logout}
      className="logout-button"
    >
      Logout
    </button>
  );
};

export default LogoutButton;