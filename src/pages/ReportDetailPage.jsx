import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ReportDetailPage.module.css';
import { fetchReportDetails, markAsPermanentResolved, rejectReport } from '../services/adminService';
import { motion } from 'framer-motion';
import { COLORS } from '../utils/constants';
import ReportMap from '../components/Map/ReportMap';
import ComparisonMap from '../components/Map/ComparisonMap';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Common/Modal';

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [distance, setDistance] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [markError, setMarkError] = useState(null);
  const [permanentStatus, setPermanentStatus] = useState(null);
  const [showComparisonMap, setShowComparisonMap] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const reportData = await fetchReportDetails(id);
        setReport(reportData);
        
        if (reportData?.status === 'permanent-resolved') {
          setPermanentStatus({
            distance: reportData.distanceToReported,
            resolvedAt: reportData.permanentlyResolvedAt,
            resolvedBy: reportData.permanentlyResolvedBy
          });
        }
      } catch (err) {
        setError('Failed to load report details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const formatCoordinates = (coords) => {
    if (!coords || !Array.isArray(coords)) return "Invalid coordinates";
    if (coords.length < 2) return "Incomplete coordinates";
    
    const [lng, lat] = coords;
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return "Invalid coordinate values";
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': 
        return { 
          color: COLORS.warning, 
          bg: COLORS.warningLight,
          icon: '⏱️'
        };
      case 'in-progress': 
        return { 
          color: COLORS.info, 
          bg: COLORS.infoLight,
          icon: '🛠️'
        };
      case 'resolved': 
        return { 
          color: COLORS.success, 
          bg: COLORS.successLight,
          icon: '✅'
        };
      case 'permanent-resolved':
        return {
          color: COLORS.primary,
          bg: COLORS.primaryLight,
          icon: '🔒'
        };
      case 'rejected': 
        return { 
          color: COLORS.error, 
          bg: COLORS.errorLight,
          icon: '❌'
        };
        case 'out-of-scope': 
        return { 
          color: COLORS.secondary, 
          bg: COLORS.secondaryLight,
          icon: '🚫'
        };
      default: 
        return { 
          color: COLORS.darkGray, 
          bg: COLORS.lightGray,
          icon: '❓'
        };
    }
  };

  const renderUserCard = (user, role) => {
    if (!user) return null;
    
    return (
      <div className={styles.userCard}>
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.username} 
            className={styles.avatarImage}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.parentNode.innerHTML = `<div class="${styles.avatarFallback}">${user.username?.charAt(0).toUpperCase() || '?'}</div>`;
            }}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {user.username?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <div>
          <p className={styles.userName}>{user.username}</p>
          <p className={styles.userRole}>{role}</p>
        </div>
      </div>
    );
  };

  const calculateDistance = () => {
    setIsCalculating(true);
    
    const [lng1, lat1] = report.location.coordinates;
    const [lng2, lat2] = report.resolvedLocation.coordinates;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c * 1000;
    
    setDistance(distance);
    setIsCalculating(false);
    setShowComparisonMap(true);
  };

  const toggleComparisonMap = () => {
    if (showComparisonMap) {
      setShowComparisonMap(false);
    } else {
      if (distance === null && report?.resolvedLocation) {
        calculateDistance();
      } else {
        setShowComparisonMap(true);
      }
    }
  };

  const handlePermanentResolve = async () => {
    try {
      setIsMarking(true);
      setMarkError(null);
      
      const response = await markAsPermanentResolved(id);
      
      setReport({
        ...report,
        status: 'permanent-resolved',
        distanceToReported: response.distance,
        permanentlyResolvedAt: new Date(),
        permanentlyResolvedBy: user
      });
      
      setPermanentStatus({
        distance: response.distance,
        resolvedAt: new Date(),
        resolvedBy: user
      });
    } catch (error) {
      console.error("Error marking as permanent:", error);
      setMarkError(
        error.message || 
        'Failed to mark as permanently resolved'
      );
    } finally {
      setIsMarking(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsMarking(true);
      setMarkError(null);
      await rejectReport(id, rejectionReason);
      
      setReport({
        ...report,
        status: 'rejected',
        rejectionReason,
        rejectedAt: new Date(),
        rejectedBy: user
      });
      
      setShowRejectionModal(false);
      setRejectionReason('');
    } catch (error) {
      setMarkError(error.message || 'Failed to reject resolution');
    } finally {
      setIsMarking(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>{error}</p>
        <Link to="/reports" className={styles.backButton}>
          &larr; Back to Reports
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status);

  return (
    <motion.div 
      className={styles.reportDetail}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <div>
          <h1>Report Details</h1>
          <div className={styles.breadcrumb}>
            <Link to="/">Dashboard</Link> &rsaquo; 
            <Link to="/reports">Reports</Link> &rsaquo; 
            <span>{report.title.substring(0, 20)}{report.title.length > 20 ? '...' : ''}</span>
          </div>
        </div>
        <Link to="/reports" className={styles.backButton}>
          &larr; Back to Reports
        </Link>
      </div>
      
      <div className={styles.gridContainer}>
        <div className={`${styles.card} ${styles.mainCard}`}>
          <div className={styles.cardHeader}>
            <h2>{report.title}</h2>
            <span 
              className={styles.statusBadge}
              style={{ 
                backgroundColor: statusConfig.bg,
                color: statusConfig.color
              }}
            >
              {statusConfig.icon} {report.status}
            </span>
          </div>
          
          <div className={styles.section}>
            <h3>Description</h3>
            <p className={styles.description}>{report.details}</p>
          </div>

          {/* Supervisor Comment Section */}
          {report.status === 'in-progress' && report.assignedMsg && (
            <div className={styles.supervisorComment}>
              <h3>Supervisor's Comment</h3>
              <div className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  {report.assignedTo?.profileImage ? (
                    <img 
                      src={report.assignedTo.profileImage} 
                      alt={report.assignedTo.username} 
                      className={styles.commentAvatar}
                    />
                  ) : (
                    <div className={styles.commentAvatarFallback}>
                      {report.assignedTo?.username?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <p className={styles.commentAuthor}>
                      {report.assignedTo?.username || 'Supervisor'}
                    </p>
                    <p className={styles.commentDate}>
                      {new Date(report.assignedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className={styles.commentText}>{report.assignedMsg}</p>
              </div>
            </div>
          )}

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Report Type</label>
              <p>{report.reportType}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Submitted By</label>
              <p>{report.user?.username} ({report.user?.email})</p>
            </div>
            <div className={styles.infoItem}>
              <label>Date Created</label>
              <p>{new Date(report.createdAt).toLocaleString()}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Last Updated</label>
              <p>{report.updatedAt ? new Date(report.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          {/* Permanent Resolution Section */}
          {report.status === 'resolved' && (
            <div className={styles.permanentResolveSection}>
              <h3>Permanent Resolution</h3>
              
              <div className={styles.buttonGroup}>
                <button 
                  onClick={toggleComparisonMap}
                  disabled={isCalculating}
                  className={styles.calculateButton}
                >
                  {isCalculating 
                    ? 'Calculating...' 
                    : showComparisonMap 
                      ? 'Hide Comparison' 
                      : 'Compare Locations'}
                </button>
                
                <button 
                  onClick={handlePermanentResolve}
                  disabled={isMarking || distance === null || distance > 10}
                  className={styles.permanentResolveButton}
                >
                  {isMarking ? 'Processing...' : 'Mark as Permanently Resolved'}
                </button>
                
                {distance !== null && distance > 10 && (
                  <button 
                    onClick={() => setShowRejectionModal(true)}
                    className={styles.rejectButton}
                  >
                    Reject Resolution
                  </button>
                )}
              </div>
              
              {distance !== null && (
                <div className={styles.distanceResult}>
                  <p>
                    Distance: <strong>{distance.toFixed(2)} meters</strong>
                  </p>
                  <p className={distance <= 10 ? styles.success : styles.error}>
                    {distance <= 10 
                      ? "✓ Within required 10-meter radius" 
                      : "⚠️ Exceeds 10-meter maximum distance"}
                  </p>
                </div>
              )}
              
              {showComparisonMap && distance !== null && (
                <ComparisonMap 
                  reportedLocation={report.location}
                  resolvedLocation={report.resolvedLocation}
                  distance={distance}
                />
              )}
              
              {markError && (
                <div className={styles.errorMessage}>
                  {markError}
                </div>
              )}
            </div>
          )}
          
          {(report.status === 'rejected' || report.rejectionReason) && (
            <div className={styles.rejectionDetails}>
              <div className={styles.rejectionHeader}>
                <span className={styles.rejectionIcon}>❌</span>
                <h3>Rejection Details</h3>
              </div>
              
              <div className={styles.rejectionContent}>
                <p><strong>Reason:</strong> {report.rejectionReason}</p>
                <p>
                  <strong>Rejected by:</strong> 
                  {(report.rejectedBy?.username || 'Admin')}
                </p>
                <p>
                  <strong>Rejected on:</strong> 
                  {new Date(report.rejectedAt).toLocaleString()}
                </p>
              </div>
              
              {report.resolvedBy && (
                <div className={styles.supervisorWarning}>
                  <h4>Supervisor Notice:</h4>
                  <p>
                    Supervisor {report.resolvedBy.username} has been notified about 
                    this rejection. Please ensure proper resolution next time.
                  </p>
                </div>
              )}
              
              {report.user && (
                <div className={styles.userNotice}>
                  <h4>User Notification:</h4>
                  <p>
                    User {report.user.username} has been notified to submit a new report 
                    if the issue persists.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {(report.status === 'permanent-resolved' || permanentStatus) && (
            <div className={styles.permanentResolvedBadge}>
              <div className={styles.badgeHeader}>
                <span className={styles.badgeIcon}>🔒</span>
                <h4>Permanently Resolved</h4>
              </div>
              
              <div className={styles.badgeDetails}>
                <p>
                  <strong>Distance to reported location:</strong> 
                  {permanentStatus?.distance?.toFixed(2) || report.distanceToReported?.toFixed(2)} meters
                </p>
                <p>
                  <strong>Resolved on:</strong> 
                  {new Date(
                    permanentStatus?.resolvedAt || report.permanentlyResolvedAt
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>By admin:</strong> 
                  {(permanentStatus?.resolvedBy?.username || report.permanentlyResolvedBy?.username) || 'System'}
                </p>
              </div>
              
              {report.resolvedLocation && (
                <div className={styles.comparisonMapContainer}>
                  <ComparisonMap 
                    reportedLocation={report.location}
                    resolvedLocation={report.resolvedLocation}
                    distance={permanentStatus?.distance || report.distanceToReported}
                  />
                </div>
              )}
            </div>
          )}
             
          {report.status === 'out-of-scope' && (
            <div className={styles.outOfScopeDetails}>
              <div className={styles.outOfScopeHeader}>
                <span className={styles.outOfScopeIcon}>🚫</span>
                <h3>Out of Scope Details</h3>
              </div>
              
              <div className={styles.outOfScopeContent}>
                <p><strong>Reason:</strong> {report.outOfScopeReason}</p>
                <p>
                  <strong>Marked by:</strong> 
                  {report.outOfScopeBy ? (
                    <span>
                      {report.outOfScopeBy.username} ({report.outOfScopeBy.email})
                    </span>
                  ) : (
                    'Supervisor'
                  )}
                </p>
                <p>
                  <strong>Marked on:</strong> 
                  {new Date(report.outOfScopeAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.card}>
          <h3>Location Information</h3>
          
          <div className={styles.infoItem}>
            <label>Reported Location</label>
            <p>{report.address}</p>
            {report.location?.coordinates && (
              <p className={styles.coordinates}>
                Coordinates: {formatCoordinates(report.location.coordinates)}
              </p>
            )}
          </div>
          
          <div className={styles.mapContainer}>
            <h4>Reported Location Map</h4>
            <ReportMap 
              location={report.location} 
              title="Reported Location" 
            />
          </div>
          
          {report.resolvedLocation && (
            <>
              <div className={styles.infoItem}>
                <label>Resolution Location</label>
                <p>{report.resolvedAddress || 'Not specified'}</p>
                {report.resolvedLocation?.coordinates && (
                  <p className={styles.coordinates}>
                    Coordinates: {formatCoordinates(report.resolvedLocation.coordinates)}
                  </p>
                )}
              </div>
              
              <div className={styles.mapContainer}>
                <h4>Resolution Location Map</h4>
                <ReportMap 
                  location={report.resolvedLocation} 
                  title="Resolution Location" 
                />
              </div>
            </>
          )}
        </div>
        
        <div className={styles.card}>
          <h3>Personnel</h3>
          
          <div className={styles.infoItem}>
            <label>Submitted By</label>
            {renderUserCard(report.user, "Reporter")}
          </div>
          
          {report.assignedTo && (
            <div className={styles.infoItem}>
              <label>Assigned To</label>
              {renderUserCard(report.assignedTo, "Field Agent")}
            </div>
          )}
          
          {report.resolvedBy && (
            <div className={styles.infoItem}>
              <label>Resolved By</label>
              {renderUserCard(report.resolvedBy, "Resolution Specialist")}
            </div>
          )}
           {report.outOfScopeBy && (
            <div className={styles.infoItem}>
              <label>Marked Out of Scope By</label>
              {renderUserCard(report.outOfScopeBy, "Supervisor")}
            </div>
          )}
        </div>
        
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3>Media Evidence</h3>
          <div className={styles.mediaGrid}>
            <div className={styles.mediaCard}>
              <h4>Original Report</h4>
              <div className={styles.imageContainer}>
                <img 
                  src={report.image} 
                  alt="Original report" 
                  className={styles.reportImage}
                />
                <div className={styles.imageOverlay}>
                  <button className={styles.viewButton}>View Full</button>
                </div>
              </div>
            </div>
            
            {report.resolvedImage && (
              <div className={styles.mediaCard}>
                <h4>Resolution Proof</h4>
                <div className={styles.imageContainer}>
                  <img 
                    src={report.resolvedImage} 
                    alt="Resolution proof" 
                    className={styles.reportImage}
                  />
                  <div className={styles.imageOverlay}>
                    <button className={styles.viewButton}>View Full</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <Modal 
          title="Reject Resolution" 
          onClose={() => setShowRejectionModal(false)}
        >
          <div className={styles.rejectionModalContent}>
            <p className={styles.warningText}>
              ⚠️ This report's resolution location is {distance.toFixed(2)} meters 
              away from the reported location, exceeding the 10-meter limit.
            </p>
            
            <div className={styles.formGroup}>
              <label>Reason for rejection:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this resolution is being rejected..."
                className={styles.reasonInput}
                rows={4}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isMarking}
              >
                {isMarking ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ReportDetailPage;