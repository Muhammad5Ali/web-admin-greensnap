import React, { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';
import { Link } from 'react-router-dom';
import homeImage from '../assets/images/home.jpeg';
import createReportImage from '../assets/images/create-report.jpeg';
import topReportersImage from '../assets/images/top-reporters.jpeg';
import perClousureDetailsImage from '../assets/images/per-clousure-details.jpeg';
import rejectionDetailsImage from '../assets/images/rejection-details.jpeg';
import profileScreenImage from '../assets/images/profile-screen.jpeg';
import { API_BASE } from '../utils/constants';

const LandingPage = () => {
  // APK Download URLs
  const mobileNetApkUrl = "https://github.com/Muhammad5Ali/greensnap-mobile/releases/download/v1.0.0/greensnap-v1.0.0.apk";
  const yoloApkUrl = "https://github.com/Muhammad5Ali/greensnap-mobile/releases/download/v1.0.0/greensnap-yolo-v3.0.0.apk";
  
  const [animated, setAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    permanentResolved: 0,
    activeSupervisors: 0,
    registeredUsers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    setAnimated(true);
    
    // Check if device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/public/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
        setStatsError(error.message);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // mailto with encoded subject and body
  const mailtoHref = encodeURI(
    'mailto:greensnapofficial@gmail.com' +
    '?subject=GreenSnap%20Inquiry' +
    '&body=Hi%20GreenSnap%20Team,%0A%0AI%20would%20like%20to%20inquire%20about%20...%0A%0AThanks,%0A'
  );

  return (
    <div className={styles.container}>
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "GreenSnap",
          "operatingSystem": "Android",
          "applicationCategory": "UtilityApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>

      {/* Enhanced Leaf Animation Background - Reduced leaf count for mobile */}
      <div className={styles.bgLeaves} aria-hidden>
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <div key={`leaf-${i}`} className={styles.leaf}></div>
        ))}
      </div>
      
      {/* Animated Background Elements */}
      <div className={styles.bgBubbles} aria-hidden>
        {[...Array(10)].map((_, i) => <div key={`bubble-${i}`} className={styles.bubble}></div>)}
      </div>
      
      <header className={`${styles.header} ${animated ? styles.animatedHeader : ''}`}>
        <div className={styles.logo} aria-label="GreenSnap logo">
          <span className={styles.green}>Green</span>Snap
        </div>
        <nav className={styles.nav} role="navigation" aria-label="Primary">
          <Link 
            to="/login" 
            className={`${styles.loginLink} ${animated ? styles.animatedNav : ''}`}
            aria-label="Go to admin login"
          >
            Admin Login
          </Link>
        </nav>
      </header>
      
      <main id="main-content" className={styles.main}>
        <div className={`${styles.hero} ${animated ? styles.animatedHero : ''}`}>
          <h1>
            <span className={styles.animatedText}>Join the </span>
            <span className={`${styles.green} ${styles.animatedHighlight}`}>Green Revolution</span>
          </h1>
          <p className={styles.subtitle}>Report waste issues in real-time. Track resolutions. Build a cleaner planet.</p>
          
          <div className={styles.downloadOptions}>
            <h3 className={styles.downloadTitle}>Choose Your App Version</h3>
            <p className={styles.downloadSubtitle}>Both versions offer the same core functionality with different AI classifiers</p>
            
            <div className={styles.downloadButtons}>
              {/* MobileNet Version */}
              <div className={styles.downloadOption}>
                <div className={styles.optionHeader}>
                  <div className={styles.modelIcon}>🚀</div>
                  <h4>MOBNETv3 Version</h4>
                </div>
                <p className={styles.optionDescription}>
                  Uses lightweight MobileNetV3 model for fast waste classification
                </p>
                <a 
                  href={mobileNetApkUrl}
                  className={`${styles.downloadButton} ${styles.pulseAnimation}`}
                  download="GreenSnap-MobileNet.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download MobileNet version (opens in a new tab)"
                >
                  <span className={styles.buttonIcon} aria-hidden>📱</span> 
                  Download MobileNet
                </a>
              </div>
              
              <div className={styles.versionDivider}>
                <span>OR</span>
              </div>
              
              {/* YOLO Version */}
              <div className={styles.downloadOption}>
                <div className={styles.optionHeader}>
                  <div className={styles.modelIcon}>🤖</div>
                  <h4>YOLOv11 Version</h4>
                </div>
                <p className={styles.optionDescription}>
                  Uses advanced YOLOv11 model for high-accuracy waste detection
                </p>
                <a 
                  href={yoloApkUrl}
                  className={`${styles.downloadButton} ${styles.pulseAnimation}`}
                  download="GreenSnap-YOLO.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download YOLO version (opens in a new tab)"
                >
                  <span className={styles.buttonIcon} aria-hidden>📱</span> 
                  Download YOLOv11
                </a>
              </div>
            </div>
            
            <Link 
              to="/login" 
              className={styles.adminButton} 
              aria-label="Go to admin portal"
            >
              <span className={styles.buttonIcon} aria-hidden>🔑</span> 
              Admin Portal
            </Link>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className={styles.features} aria-live="polite">
          <div className={`${styles.feature} ${animated ? styles.animatedFeature1 : ''}`}>
            <div className={styles.featureIcon} aria-hidden>📱</div>
            <h3>Real-time Reporting</h3>
            <p>Instantly report waste issues with GPS tagging and photo evidence</p>
          </div>
          
          <div className={`${styles.feature} ${animated ? styles.animatedFeature2 : ''}`}>
            <div className={styles.featureIcon} aria-hidden>📊</div>
            <h3>Live Status Tracking</h3>
            <p>Monitor resolution progress from report to cleanup completion</p>
          </div>
          
          <div className={`${styles.feature} ${animated ? styles.animatedFeature3 : ''}`}>
            <div className={styles.featureIcon} aria-hidden>👥</div>
            <h3>Multi-tier Workflow</h3>
            <p>Citizen → Supervisor → Administrator verification system</p>
          </div>
        </div>
        
        {/* Process Visualization - Fixed Alignment */}
        <div className={styles.process}>
          <h2>How GreenSnap Works</h2>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Report</h3>
              <p>Citizens report waste issues</p>
            </div>
            
            <div className={styles.stepArrow} aria-hidden>→</div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Assign</h3>
              <p>Supervisors assign cleanup crews</p>
            </div>
            
            <div className={styles.stepArrow} aria-hidden>→</div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Resolve</h3>
              <p>Supervisor Update Status</p>
            </div>
            
            <div className={styles.stepArrow} aria-hidden>→</div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Verify</h3>
              <p>Administrators confirm resolution</p>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsHeader}>
            <h2 className={styles.statsTitle}>Our Environmental Impact</h2>
            <p className={styles.statsSubtitle}>Real-time statistics showcasing our collective achievements</p>
          </div>
          
          <div className={styles.stats}>
            {statsLoading ? (
              // Loading skeleton
              [1, 2, 3].map((_, index) => (
                <div key={index} className={`${styles.statCard} ${styles.skeleton}`}>
                  <div className={styles.skeletonText}></div>
                  <div className={`${styles.skeletonText} ${styles.short}`}></div>
                </div>
              ))
            ) : statsError ? (
              <div className={styles.errorMessage}>
                Stats unavailable. Please try again later.
              </div>
            ) : (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>✅</div>
                  <h3>{stats.permanentResolved}</h3>
                  <p>Per-Resolved Reports</p>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <h3>{stats.activeSupervisors}</h3>
                  <p>Active Supervisors</p>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👤</div>
                  <h3>{stats.registeredUsers}</h3>
                  <p>Registered Users</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Technical Comparison Section */}
        <div className={styles.techComparison}>
          <h2>Technology Comparison</h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <div className={styles.modelHeader}>
                <div className={styles.modelIconLarge}>🚀</div>
                <h3>MobileNetV3</h3>
              </div>
              <ul className={styles.techFeatures}>
                <li>✅ Lightweight model </li>
                <li>⚡ Faster processing on low-end devices</li>
                <li>📱 Optimized for mobile performance</li>
                <li>⚙️ Efficient resource usage</li>
              </ul>
            </div>
            
            <div className={styles.comparisonCard}>
              <div className={styles.modelHeader}>
                <div className={styles.modelIconLarge}>🤖</div>
                <h3>YOLOv11</h3>
              </div>
              <ul className={styles.techFeatures}>
                <li>🎯 Higher detection accuracy</li>
                <li>🔍 Better object recognition</li>
                <li>🖼️ Handles complex scenes effectively</li>
                <li>📈 Advanced computer vision</li>
              </ul>
            </div>
          </div>
          <p className={styles.techNote}>
           The core reporting and tracking functionality of both versions is identical.
          </p>
        </div>
        
        {/* App Screenshots */}
        <div className={styles.screenshots}>
          <h2>Track Report & Contribute to Community</h2>
          <div className={styles.screenshotGrid}>
            {/* Home Page */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={homeImage} 
                  alt="Home Page" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Home Page</p>
            </div>
            
            {/* Create Report */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={createReportImage} 
                  alt="Create Report Interface" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Create Report</p>
            </div>
            
            {/* Top Reporters */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={topReportersImage} 
                  alt="Top Reporters Leaderboard" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Top Reporters</p>
            </div>
            
            {/* Per-Clousure Details */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={perClousureDetailsImage} 
                  alt="Per-Clousure Details" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Per-Clousure Details</p>
            </div>
            
            {/* Rejection Details */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={rejectionDetailsImage} 
                  alt="Rejection Details" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Rejection Details</p>
            </div>
            
            {/* Profile Screen */}
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={profileScreenImage} 
                  alt="User Profile Screen" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Profile Screen</p>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className={styles.finalCta}>
          <h2>Ready to make a difference?</h2>
          <p className={styles.ctaSubtitle}>Download the version that works best for your device</p>
          <div className={styles.ctaButtons}>
            <a 
              href={mobileNetApkUrl} 
              className={`${styles.downloadButton} ${styles.largeButton}`}
              download="GreenSnap-MobileNet.apk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download MobileNet version (opens in a new tab)"
            >
              Download MobileNet Version
            </a>
            <a 
              href={yoloApkUrl} 
              className={`${styles.downloadButton} ${styles.largeButton} ${styles.yoloButton}`}
              download="GreenSnap-YOLO.apk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download YOLO version (opens in a new tab)"
            >
              Download YOLOv11 Version
            </a>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} GreenSnap Inc. All rights reserved.
          </p>
          <div className={styles.emailContainer}>
            <span className={styles.emailLabel}>Mail To:</span>
            <a
              href={mailtoHref}
              className={styles.emailLink}
              aria-label="Email GreenSnap official"
            >
              greensnapofficial@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;