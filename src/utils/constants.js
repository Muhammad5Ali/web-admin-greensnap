// export const COLORS = {
//   primary: "#4CAF50",
//   textPrimary: "#2e5a2e",
//   textSecondary: "#688f68",
//   darkGray: "#616161",
//   lightGray: "#e0e0e0",
//   placeholderText: "#767676",
//   background: "#e8f5e9",
//   lightBackground: "#e8f5e9",
//   cardBackground: "#f1f8f2",
//   inputBackground: "#f4faf5",
//   border: "#c8e6c9",
//   white: "#ffffff",
//   black: "#000000",
//   success: '#4BB543',
//   error: "#d32f2f",
//   warning: "#FFA000",
//   info: "#2196F3",
// };

// export const API_URL = "http://localhost:3000/api/auth";


export const COLORS = {
  primary: "var(--primary)",
  textPrimary: "var(--textPrimary)",
  textSecondary: "var(--textSecondary)",
  darkGray: "#616161",
  lightGray: "var(--lightGray)",
  placeholderText: "#767676",
  background: "var(--background)",
  lightBackground: "#e8f5e9",
  cardBackground: "var(--cardBackground)",
  inputBackground: "#f4faf5",
  border: "var(--border)",
  white: "#ffffff",
  black: "#000000",
  success: '#4BB543',
  error: "var(--error)",
  warning: "#FFA000",
  info: "#2196F3",
  primaryDark: "var(--primary-dark)",
  secondary: '#FFC107',
  accent: '#4CAF50',
  scope: '#9E9E9E',
  resolved: '#2E7D32',
};

export const STATUS_COLORS = {
  new: "#FFC107",
  inProgress: "#2196F3",
  resolved: "#4CAF50",
  permanentResolved: "#2E7D32",
  rejected: "#F44336",
  outOfScope: "#9E9E9E"
};

export const STATUS_COLORS_NEW = {
  pending: '#FFC107',
  inprogress: '#2196F3',
  resolved: '#4CAF50',
  permanentresolved: '#2E7D32',
  rejected: '#F44336',
  outofscope: '#9E9E9E'
};

export const SHADOWS = {
  small: "0 2px 8px rgba(0,0,0,0.1)",
  medium: "0 4px 12px rgba(0,0,0,0.15)",
  large: "0 8px 24px rgba(0,0,0,0.2)"
};

export const TRANSITIONS = {
  fast: "all 0.2s ease",
  medium: "all 0.3s ease",
  slow: "all 0.5s ease"
};
export const API_URL = import.meta.env.VITE_API_BASE + '/api/auth';
// export const API_URL = "https://gs-admin.onrender.com/api/auth";
// export const API_URL = "http://localhost:3000/api/auth";
// Add these at the bottom of utils/constant.js
export const API_BASE = import.meta.env.VITE_API_BASE;
