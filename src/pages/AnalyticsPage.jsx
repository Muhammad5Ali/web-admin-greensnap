import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { fetchAnalyticsData } from '../services/adminService';
import styles from './AnalyticsPage.module.css';
import { COLORS, STATUS_COLORS,STATUS_COLORS_NEW  } from '../utils/constants';

const AnalyticsPage = () => {
  const [reportDistribution, setReportDistribution] = useState([]);
  const [supervisorPerformance, setSupervisorPerformance] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [reportTrends, setReportTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalyticsData();
        
        setReportDistribution(data.reportDistribution);
        setSupervisorPerformance(data.supervisorPerformance);
        setAttendanceTrends(data.attendanceTrends);
        setUserActivity(data.userActivity);
        setReportTrends(data.reportTrends);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCharts = () => (
    <div className={styles.gridContainer}>
      {/* Report Distribution (Pie Chart) */}
      <div className={`${styles.chartCard} ${styles.fullWidth}`}>
        <h3>Report Status Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={reportDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {reportDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLORS_NEW[entry.status.toLowerCase().replace('-', '')] || '#8884d8'} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Supervisor Performance (Bar Chart) */}
      <div className={`${styles.chartCard} ${styles.fullWidth}`}>
        <h3>Supervisor Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={supervisorPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supervisor" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="resolved" name="Resolved" fill={COLORS.success} />
            <Bar dataKey="permanentResolved" name="Permanent Resolved" fill={COLORS.resolved} />
            <Bar dataKey="rejected" name="Rejected" fill={COLORS.error} />
            <Bar dataKey="outOfScope" name="Out of Scope" fill={COLORS.secondary} />
            <Bar dataKey="inProgress" name="In Progress" fill={COLORS.scope} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Worker Attendance (Line Chart) */}
      <div className={`${styles.chartCard} ${styles.fullWidth}`}>
        <h3>Worker Attendance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="present" 
              name="Present" 
              stroke={COLORS.success} 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="absent" 
              name="Absent" 
              stroke={COLORS.error} 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="onLeave" 
              name="On Leave" 
              stroke={COLORS.warning} 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Activity (Area Chart) */}


      {/* Report Trends (Line Chart) */}
      <div className={`${styles.chartCard} ${styles.fullWidth}`}>
        <h3>Report Trends (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reportTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Reports Submitted" 
              stroke={COLORS.primary} 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p>{error}</p>
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
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <h1>Analytics Dashboard</h1>
        <p>Visual insights into platform performance and metrics</p>
      </div>
      
      {renderCharts()}
    </div>
  );
};

export default AnalyticsPage;