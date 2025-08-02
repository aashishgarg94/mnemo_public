import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from './Tracking.module.css';
import childData from '../../mockData/childData.json';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';

console.log("tracking");

const Tracking = () => {
  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <DashboardNav />
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Weekly Progress Chart */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <h3 className={styles.sectionTitle}>Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={childData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="focus" stroke="#8884d8" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" />
                <Line type="monotone" dataKey="problemSolving" stroke="#ffc658" />
                <Line type="monotone" dataKey="creativity" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Key Metrics</h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <div className={styles.metricValue}>{childData.keyMetrics.gamesCompleted}</div>
                <div className={styles.metricLabel}>Games Completed</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricValue}>{childData.keyMetrics.totalPlayTime}</div>
                <div className={styles.metricLabel}>Total Play Time</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricValue}>{childData.keyMetrics.averageSessionLength}</div>
                <div className={styles.metricLabel}>Avg. Session Length</div>
              </div>
            </div>
          </div>

          {/* Historical Comparison */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Monthly Comparison</h3>
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonLabel}>This Month</div>
                <div className={styles.comparisonValue}>
                  {childData.historicalComparison.currentMonth.gamesPlayed} Games
                </div>
                <div className={styles.comparisonValue}>
                  {childData.historicalComparison.currentMonth.averageScore}% Avg. Score
                </div>
              </div>
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonLabel}>Last Month</div>
                <div className={styles.comparisonValue}>
                  {childData.historicalComparison.lastMonth.gamesPlayed} Games
                </div>
                <div className={styles.comparisonValue}>
                  {childData.historicalComparison.lastMonth.averageScore}% Avg. Score
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Recent Achievements</h3>
            <div className={styles.badgesList}>
              {childData.badges.map(badge => (
                <div key={badge.id} className={styles.badge}>
                  <div className={styles.badgeIcon}>{badge.icon}</div>
                  <div className={styles.badgeInfo}>
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Improved Skills */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Most Improved Skills</h3>
            {childData.mostImprovedSkills.map(skill => (
              <div key={skill.skill} className={styles.skillProgress}>
                <div className={styles.skillName}>{skill.skill}</div>
                <div className={styles.skillBar}>
                  <div 
                    className={styles.skillFill} 
                    style={{ width: `${(skill.currentScore / 100) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.improvement}>{skill.improvement}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
