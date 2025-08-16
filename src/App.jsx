import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import ReportDetailPage from './pages/ReportDetailPage';
import SupervisorsPage from './pages/SupervisorsPage';
import UsersPage from './pages/UsersPage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary'; 
import WorkersPage from './pages/WorkersPage';
import WorkerAttendancePage from './pages/WorkerAttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import './styles/responsive.css';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ErrorBoundary> {/* Wrap everything in ErrorBoundary */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports/:id" 
              element={
                <PrivateRoute>
                  <ReportDetailPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/supervisors" 
              element={
                <PrivateRoute>
                  <SupervisorsPage />
                </PrivateRoute>
              } 
            />
            <Route
  path="/users"
  element={
    <PrivateRoute>
      <UsersPage />
    </PrivateRoute>
  }
/>

            <Route 
  path="/workers" 
  element={
    <PrivateRoute>
      <WorkersPage />
    </PrivateRoute>
  } 
/>
<Route 
  path="/workers/:workerId/attendance" 
  element={
    <PrivateRoute>
      <WorkerAttendancePage />
    </PrivateRoute>
  } 
/>
<Route 
  path="/analytics" 
  element={
    <PrivateRoute>
      <AnalyticsPage />
    </PrivateRoute>
  } 
/>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;