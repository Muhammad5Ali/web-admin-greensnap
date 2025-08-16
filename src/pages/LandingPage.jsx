import React, { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';
import { Link } from 'react-router-dom';
import reportImage from '../assets/images/report-interface.jpeg';
import trackingImage from '../assets/images/tracking-map.jpeg';
import verifyImage from '../assets/images/verified-cleanup.jpeg';

const LandingPage = () => {
  const apkDownloadUrl = "https://github.com/Muhammad5Ali/greensnap-mobile/releases/download/v1.0.0/greensnap-v1.0.0.apk";
  const [animated, setAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          
          <div className={styles.buttons}>
            <a 
              href={apkDownloadUrl}
              className={`${styles.downloadButton} ${styles.pulseAnimation}`}
              download="GreenSnap.apk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download GreenSnap mobile app (opens in a new tab)"
            >
              <span className={styles.buttonIcon} aria-hidden>📱</span> 
              Download Mobile App
            </a>

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
        
        {/* Animated Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>4+</h3>
            <p>Permanent Resolved Reports</p>
          </div>
          <div className={styles.statCard}>
            <h3>3+</h3>
            <p>Active Supervisors</p>
          </div>
          <div className={styles.statCard}>
            <h3>7+</h3>
            <p>Registered Users</p>
          </div>
        </div>
        
        {/* App Screenshots */}
        <div className={styles.screenshots}>
          <h2>See It In Action</h2>
          <div className={styles.screenshotGrid}>
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={reportImage} 
                  alt="Report waste interface" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Report Waste</p>
            </div>
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={trackingImage} 
                  alt="Live tracking map" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>Report Tracking</p>
            </div>
            <div className={styles.screenshotFrame}>
              <div className={styles.phoneMockup}>
                <img 
                  src={verifyImage} 
                  alt="Verified cleanup proof" 
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              </div>
              <p>All Reports</p>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className={styles.finalCta}>
          <h2>Ready to make a difference?</h2>
          <a 
            href={apkDownloadUrl} 
            className={`${styles.downloadButton} ${styles.largeButton}`}
            download="GreenSnap.apk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download GreenSnap app now (opens in a new tab)"
          >
            Download App Now
          </a>
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