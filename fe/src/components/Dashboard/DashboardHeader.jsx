import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from './DashboardHeader.module.css';

const DashboardHeader = () => {
    const navigate = useNavigate();
    const { clearOnboardingData } = useOnboarding();

    const handleLogout = () => {
        clearOnboardingData();
        // Force navigation to mobile input
        navigate('/parent/mobile', { replace: true });
    };

    return (
        <div className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
