import React, { useState } from 'react';
import styles from './Hero.module.css';
import WaitlistOverlay from '../WaitlistOverlay/WaitlistOverlay';

const Hero = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>A New Way to Learn, Grow, and Explore</h1>
        <p>Empower your child’s curiosity through an experiential learning modules to foster learning</p>
        {/* <button className={styles.ctaButton} onClick={() => setIsOverlayOpen(true)}>
          Join Waitlist
        </button> */}
      </div>
      <div className={styles.heroOverlay}></div>
      <WaitlistOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
      />
    </section>
  );
};

export default Hero;
