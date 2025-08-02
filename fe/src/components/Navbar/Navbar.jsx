import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo} onClick={() => scrollToSection('hero')}>
        MNEMO
      </div>
      <div className={styles.links}>
        {/* <button onClick={() => scrollToSection('gametrailer')}>Teaser</button> */}
        {/* <button onClick={() => scrollToSection('agents')}>Mini Games</button> */}
        {/* <button onClick={() => scrollToSection('faq')}>FAQ</button> */}
      </div>
    </nav>
  );
};

export default Navbar;
