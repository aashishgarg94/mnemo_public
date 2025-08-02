import React from 'react';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';
import styles from './Dashboard.module.css';

const Store = () => {
  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <DashboardNav />
      <div className={styles.content}>
        <h1>Store</h1>
        {/* Store content */}
      </div>
    </div>
  );
};

export default Store;
