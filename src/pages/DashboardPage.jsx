import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import StatsCard from '../components/Dashboard/StatsCard';
import styles from './Dashboard.module.css';
import { 
  fetchDashboardStats,
  fetchReportsOverview,
  fetchUserActivity
} from '../services/adminService';
import { COLORS, STATUS_COLORS } from '../utils/constants';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [reportsData, setReportsData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel with error handling
        const [statsData, reportsOverview, userActivity] = await Promise.all([
          fetchDashboardStats().catch(() => ({
            totalReports: 0,
            resolvedReports: 0,
            resolutionRate: 0,
            totalUsers: 0,
            totalSupervisors: 0,
            pendingReports: 0,
            rejectedReports: 0,
            permanentResolvedReports: 0,
            inProgressReports: 0,
            outOfScopeReports: 0
          })),
          fetchReportsOverview().catch(() => []),
          fetchUserActivity().catch(() => [])
        ]);
        
        setStats(statsData);
        setReportsData(reportsOverview);
        setUserActivityData(userActivity);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard data...</p>
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
   
   const statsConfig = [
    {
      title: "Total Reports", 
      value: stats?.totalReports || 0, 
      description: "All reports submitted",
      icon: "📝",
      color: COLORS.primary,
      accentColor: COLORS.lightBackground
    },
   {
  title: "Resolved Reports", 
  value: stats?.resolvedReports || 0, 
  description: "Successfully resolved issues", 
  icon: "✅",
  color: COLORS.success,
  accentColor: "#e8f5e9"
},
    {
      title: "Pending Reports", 
      value: stats?.pendingReports || 0, 
      description: "Awaiting action",
      icon: "⏱️",
      color: COLORS.warning,
      accentColor: "#fff8e1"
    },
    {
      title: "Rejected Reports", 
      value: stats?.rejectedReports || 0, 
      description: "Failed verification",
      icon: "❌",
      color: COLORS.error,
      accentColor: "#ffebee"
    },
    {
      title: "Permanent-Resolved", 
      value: stats?.permanentResolvedReports || 0, 
      description: "Verified resolutions",
      icon: "🔒",
      color: COLORS.info,
      accentColor: "#e3f2fd"
    },
     {
    title: "In Progress", 
    value: stats?.inProgressReports || 0, 
    description: "Currently being addressed",
    icon: "🔄",
    color: "#2196F3",  // Blue
    accentColor: "#E3F2FD"
  },
  {
    title: "Out of Scope", 
    value: stats?.outOfScopeReports || 0, 
    description: "Marked as non-applicable",
    icon: "🚫",
    color: "#9E9E9E",  // Gray
    accentColor: "#F5F5F5"
  },
    {
      title: "Active Supervisors", 
      value: stats?.totalSupervisors || 0, 
      description: "Managing cleanup operations",
      icon: "👥",
      color: COLORS.secondary,
      accentColor: "#f3e5f5"
    },
    {
      title: "Registered Users", 
      value: stats?.totalUsers || 0, 
      description: "Citizens contributing",
      icon: "👤",
      color: COLORS.accent,
      accentColor: "#e8faf0"
    }
  ];
  
  const formatNumber = (num) => {
    if (num === undefined || num === null || typeof num !== 'number') {
      return '0';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <main className={styles.content}>
        <div className={styles.welcomeCard}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Real-time platform analytics and insights</p>
          </div>
          <div className={styles.dateBadge}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <div className={styles.statsGrid}>
          {statsConfig.map((stat, index) => (
            <StatsCard 
              key={index}
              title={stat.title}
              value={formatNumber(stat.value)}
              description={stat.description}
              icon={stat.icon}
              color={stat.color}
              accentColor={stat.accentColor}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className={styles.chartsContainer}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Reports Overview</h3>
              <p className={styles.chartSubtitle}>Last 7 days</p>
            </div>
            <div className={styles.chartWrapper}>
              {reportsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart 
                    data={reportsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    barSize={12}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                  <YAxis 
  domain={[0, 'dataMax + 2']}
  tickCount={6}
  allowDecimals={false}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => Math.round(value)}
/>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: COLORS.cardBackground,
                        borderColor: COLORS.border,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      content={({ payload }) => (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          padding: '10px 0',
                          maxHeight: '60px',
                          overflowY: 'auto'
                        }}>
                          {payload.map((entry, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              alignItems: 'center',
                              margin: '0 10px'
                            }}>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                background: entry.color,
                                marginRight: '5px'
                              }} />
                              <span style={{ fontSize: '12px' }}>{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <Bar dataKey="new" name="New Reports" fill={STATUS_COLORS.new} />
                    <Bar dataKey="inProgress" name="In Progress" fill={STATUS_COLORS.inProgress} />
                    <Bar dataKey="resolved" name="Resolved" fill={STATUS_COLORS.resolved} />
                    <Bar dataKey="permanentResolved" name="Permanent Resolved" fill={STATUS_COLORS.permanentResolved} />
                    <Bar dataKey="rejected" name="Rejected" fill={STATUS_COLORS.rejected} />
                    <Bar dataKey="outOfScope" name="Out of Scope" fill={STATUS_COLORS.outOfScope} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.noData}>
                  <p>No report data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* User Activity Chart Section */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>User Engagement Activity</h3>
              <p className={styles.chartSubtitle}>Last 12 hours • <span style={{color: COLORS.primary}}>Users</span> vs <span style={{color: COLORS.warning}}>Reports</span></p>
            </div>
            <div className={styles.chartWrapper}>
              {userActivityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart 
                    data={userActivityData} 
                    margin={{ top: 15, right: 20, bottom: 15, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGray} vertical={false} />
                    <XAxis 
                      dataKey="hour" 
                      stroke={COLORS.textSecondary} 
                      tickLine={false}
                      tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke={COLORS.textSecondary} 
                      tickLine={false}
                      tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                      domain={[0, 'dataMax + 2']}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke={COLORS.textSecondary} 
                      tickLine={false}
                      tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                      domain={[0, 'dataMax + 2']}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className={styles.customTooltip}>
                              <p className={styles.tooltipLabel}>{`Hour: ${label}`}</p>
                              <div className={styles.tooltipItem}>
                                <span className={styles.tooltipDot} style={{background: COLORS.primary}}></span>
                                <span>Active Users: </span>
                                <strong>{payload[0].value}</strong>
                              </div>
                              <div className={styles.tooltipItem}>
                                <span className={styles.tooltipDot} style={{background: COLORS.warning}}></span>
                                <span>Reports Submitted: </span>
                                <strong>{payload[1].value}</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      contentStyle={{ 
                        backgroundColor: COLORS.cardBackground,
                        borderColor: COLORS.border,
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '12px 16px'
                      }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={40}
                      iconSize={12}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ 
                          color: value === 'Active Users' ? COLORS.primary : COLORS.warning,
                          fontWeight: 600 
                        }}>
                          {value}
                        </span>
                      )}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke={COLORS.primary} 
                      strokeWidth={3}
                      activeDot={{ 
                        r: 8, 
                        stroke: COLORS.primary, 
                        strokeWidth: 2,
                        fill: '#fff',
                        style: { boxShadow: `0 0 0 4px ${COLORS.primary}33` }
                      }} 
                      name="Active Users"
                      dot={{ 
                        r: 4, 
                        stroke: COLORS.primary, 
                        strokeWidth: 2, 
                        fill: '#fff' 
                      }}
                      animationDuration={500}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="reportsSubmitted" 
                      stroke={COLORS.warning} 
                      strokeWidth={3}
                      strokeDasharray="4 4"
                      name="Reports Submitted"
                      activeDot={{ 
                        r: 8, 
                        stroke: COLORS.warning, 
                        strokeWidth: 2,
                        fill: '#fff',
                        style: { boxShadow: `0 0 0 4px ${COLORS.warning}33` }
                      }}
                      dot={{ 
                        r: 4, 
                        stroke: COLORS.warning, 
                        strokeWidth: 2, 
                        fill: '#fff' 
                      }}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.noData}>
                  <p>No user activity data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;