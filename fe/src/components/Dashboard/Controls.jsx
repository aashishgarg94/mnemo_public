import React from 'react';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';
import styles from './Dashboard.module.css';

const Controls = () => {
  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <DashboardNav />
      <div className={styles.content}>
        <h1>Controls</h1>
        {/* Controls content */}
      </div>
    </div>
  );
};

export default Controls;
