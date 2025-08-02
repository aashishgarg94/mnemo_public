import React, { useState, useEffect, useRef } from 'react';
import styles from './CTA.module.css';
import WaitlistOverlay from '../WaitlistOverlay/WaitlistOverlay';

const CTA = () => {
  const [isBuilderOverlayOpen, setIsBuilderOverlayOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  return (
    <section id="cta" className={styles.cta}>
    <div className={styles.ctaOverlay}></div>
      <div className={styles.ctaContent}>
        <h3 
          ref={titleRef}
          className={`${styles.title} ${isVisible ? styles.visible : ''}`}
        >
          Your Child Deserves More Than Just Screen Time—They Deserve Growth Time
          </h3>
        {/* <p>Sign up now to secure early access and exclusive updates</p> */}
        <div className={styles.ctaButtons}>
          {/* <button 
            className={styles.primaryButton}
            onClick={() => setIsBuilderOverlayOpen(true)}
          >
            Join Waitlist
          </button> */}
        </div>
      </div>
      <WaitlistOverlay 
        isOpen={isBuilderOverlayOpen}
        onClose={() => setIsBuilderOverlayOpen(false)}
        title="Join Waitlist"
        description="Be among the first to get early access too Mnemo"
      />
    </section>
  );
};

export default CTA;
