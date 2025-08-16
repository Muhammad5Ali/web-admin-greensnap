import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
// const API_URL = "http://localhost:3000/api/auth";
// const API_URL =  "https://gs-admin.onrender.com/api/auth";
const API_URL = import.meta.env.VITE_API_BASE + '/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('adminUser');
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (e) {
  //       console.error("Error parsing stored user", e);
  //     }
  //   }
  //   setLoading(false);
  // }, []);

  useEffect(() => {
  const storedUser = localStorage.getItem('adminUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      console.error("Error parsing stored user", e);
    }
  }
  setLoading(false);
}, []);
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password,client: "web" })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('adminToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  // const logout = () => {
  //   localStorage.removeItem('adminUser');
  //   localStorage.removeItem('adminToken');
  //   setUser(null);
  //   window.location.href = '/login';
  // };

  const logout = async () => {
  try {
    // Call backend logout endpoint
    await fetch(`https://gs-admin.onrender.com/admin/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  } catch (error) {
    console.error('Logout error', error);
  } finally {
    // Clear frontend storage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setUser(null);
    window.location.href = '/login';
  }
};
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);