import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaSlidersH, FaFileAlt, FaStore } from 'react-icons/fa';
import styles from './DashboardNav.module.css';

const navItems = [
    { path: '/parent/tracking', icon: FaChartLine, label: 'Tracking' },
    { path: '/parent/community', icon: FaUsers, label: 'Community' },
    { path: '/parent/controls', icon: FaSlidersH, label: 'Controls' },
    { path: '/parent/reports', icon: FaFileAlt, label: 'Reports' },
    { path: '/parent/store', icon: FaStore, label: 'Store' }

];

const DashboardNav = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          {navItems.map(({ path, label }) => (
            <li key={path} className={styles.navItem}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                end={path === '/dashboard'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={styles.mobileNav}>
        <ul className={styles.mobileNavList}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path} className={styles.mobileNavItem}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                }
                end={path === '/parent'}
              >
                <Icon />
                <div className={styles.mobileNavText}>{label}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default DashboardNav;
