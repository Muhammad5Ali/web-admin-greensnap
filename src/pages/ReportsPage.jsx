import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReportList from '../components/Reports/ReportList';
import styles from './ReportsPage.module.css';
import { 
  fetchReports, 
  fetchReportStatusCounts 
} from '../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    total: 0, 
    limit: 10,
    totalPages: 1
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    permanentResolved: 0 ,
    rejected: 0,
     outOfScope: 0 
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);
  
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status') || '';
  const page = parseInt(queryParams.get('page')) || 1;
  const limit = parseInt(queryParams.get('limit')) || 10;
  const search = queryParams.get('search') || '';

  // Load reports data
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setIsSearching(search !== '');
        const reportsData = await fetchReports(status, page, limit, search);
        
        setReports(reportsData.reports);
        setPagination({
          page: reportsData.currentPage,
          total: reportsData.total,
          limit: reportsData.limit,
          totalPages: reportsData.totalPages
        });
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    loadReports();
  }, [status, page, limit, search]);

  // Set initial search term from URL
  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  // Load and auto-refresh stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const statsData = await fetchReportStatusCounts();
        setStats({
          total: statsData.counts.total,
          pending: statsData.counts.pending,
          inProgress: statsData.counts.inProgress,
          resolved: statsData.counts.resolved,
          permanentResolved: statsData.counts.permanentResolved,
          rejected: statsData.counts.rejected,
          outOfScope: statsData.counts.outOfScope
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setStatsError('Failed to load dashboard statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    // Initial load
    loadStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (newStatus) => {
    const params = new URLSearchParams();
    if (newStatus) params.set('status', newStatus);
    if (search) params.set('search', search);
    params.set('page', 1);
    navigate(`/reports?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    params.set('page', newPage);
    navigate(`/reports?${params.toString()}`);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to trigger search after 500ms of inactivity
    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (value) params.set('search', value);
      else params.delete('search');
      params.set('page', 1);
      navigate(`/reports?${params.toString()}`);
    }, 500);
  };

  // Handle explicit search submit (button click or enter)
  const handleSearchSubmit = () => {
    // Clear any pending timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');
    params.set('page', 1);
    navigate(`/reports?${params.toString()}`);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.reportsPage}>
      <div className={styles.pageHeader}>
        <h1>Reports Dashboard</h1>
        
        {statsError && (
          <div className={styles.statsError}>
            <span>⚠️</span> {statsError}
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}
        
        <div className={styles.summary}>
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.summaryItem}>
                <div className={styles.summaryValueSkeleton}></div>
                <div className={styles.summaryLabelSkeleton}></div>
              </div>
            ))
          ) : (
            <>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>{stats.total}</div>
                <div className={styles.summaryLabel}>Total Reports</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>{stats.pending}</div>
                <div className={styles.summaryLabel}>Pending</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>{stats.inProgress}</div>
                <div className={styles.summaryLabel}>In Progress</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>{stats.resolved}</div>
                <div className={styles.summaryLabel}>Resolved</div>
              </div>
                <div className={styles.summaryItem}>
              <div className={styles.summaryValue}>{stats.permanentResolved}</div>
                <div className={styles.summaryLabel}>Permanent Resolved</div>
              </div>
             <div className={styles.summaryItem}>
             <div className={styles.summaryValue}>{stats.rejected}</div>
             <div className={styles.summaryLabel}>Rejected</div>
    </div>
      <div className={styles.summaryItem}>
      <div className={styles.summaryValue}>{stats.outOfScope}</div>
      <div className={styles.summaryLabel}>Out of Scope</div>
    </div>
            </>
          )}
        </div>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${status === '' ? styles.active : ''}`}
            onClick={() => handleStatusChange('')}
          >
            All Reports
          </button>
          <button 
            className={`${styles.filterButton} ${status === 'pending' ? styles.active : ''}`}
            onClick={() => handleStatusChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`${styles.filterButton} ${status === 'in-progress' ? styles.active : ''}`}
            onClick={() => handleStatusChange('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`${styles.filterButton} ${status === 'resolved' ? styles.active : ''}`}
            onClick={() => handleStatusChange('resolved')}
          >
            Resolved
          </button>
          <button 
        className={`${styles.filterButton} ${status === 'permanent-resolved' ? styles.active : ''}`}
        onClick={() => handleStatusChange('permanent-resolved')}
          >
          Permanent Resolved
           </button>
              <button 
        className={`${styles.filterButton} ${status === 'rejected' ? styles.active : ''}`}
        onClick={() => handleStatusChange('rejected')}
        >
          Rejected
        </button>
           <button 
            className={`${styles.filterButton} ${status === 'out-of-scope' ? styles.active : ''}`}
            onClick={() => handleStatusChange('out-of-scope')}
            >
         Out of Scope
        </button>
        </div>
        
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search reports..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
          />
          <button 
            className={styles.searchButton}
            onClick={handleSearchSubmit}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className={styles.searchSpinner}></div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading reports...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : reports.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📭</div>
          <h3>No reports found</h3>
          <p>Try changing your filters or search terms</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReportList reports={reports} />
            <div className={styles.pagination}>
              <button 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className={styles.paginationButton}
              >
                &larr; Previous
              </button>
              <div className={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className={styles.paginationButton}
              >
                Next &rarr;
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReportsPage;