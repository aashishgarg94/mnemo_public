import React from 'react';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';
import styles from './Dashboard.module.css';

const Reports = () => {
  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <DashboardNav />
      <div className={styles.content}>
        <h1>Reports</h1>
        {/* Reports content */}
      </div>
    </div>
  );
};

export default Reports;
