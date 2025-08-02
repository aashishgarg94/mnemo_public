import React, { useState } from 'react';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';
import styles from './Community.module.css';
import leagueData from '../../mockData/leagueData.json';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Community = () => {
  const [activeLeague, setActiveLeague] = useState('family');
  const [timeframe, setTimeframe] = useState('weekly');
  const [showAddMember, setShowAddMember] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [familyMembers, setFamilyMembers] = useState(leagueData.familyLeague.members);
  const [backupIndex, setBackupIndex] = useState(0);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (backupIndex >= leagueData.familyLeague.backupMembers.length) {
      alert('No more backup members available');
      return;
    }

    const backupMember = leagueData.familyLeague.backupMembers[backupIndex];
    const newMember = {
      id: Math.random(),
      ...backupMember,
      phone: phoneNumber
    };
    
    setFamilyMembers(prev => [...prev, newMember]);
    setBackupIndex(prev => prev + 1);
    setPhoneNumber('');
    setShowAddMember(false);
  };

  const currentMembers = activeLeague === 'family' 
    ? familyMembers 
    : leagueData.schoolLeague.members;

  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <DashboardNav />
      <div className={styles.content}>
        {/* League Toggle */}
        <div className={styles.leagueToggle}>
          <button
            className={`${styles.toggleButton} ${activeLeague === 'family' ? styles.active : ''}`}
            onClick={() => setActiveLeague('family')}
          >
            Family League
          </button>
          <button
            className={`${styles.toggleButton} ${activeLeague === 'school' ? styles.active : ''}`}
            onClick={() => setActiveLeague('school')}
          >
            School League
          </button>
        </div>

        {/* Leaderboard Section */}
        <div className={styles.leaderboardSection}>
          <div className={styles.leaderboardHeader}>
            <div className={styles.timeframeToggle}>
              <button
                className={`${styles.timeframeButton} ${timeframe === 'weekly' ? styles.active : ''}`}
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </button>
              <button
                className={`${styles.timeframeButton} ${timeframe === 'monthly' ? styles.active : ''}`}
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </button>
            </div>
            {activeLeague === 'family' && (
              <button
                className={styles.manageButton}
                onClick={() => setShowAddMember(!showAddMember)}
              >
                {showAddMember ? <FaTimes /> : <FaPlus />} Manage
              </button>
            )}
          </div>

          {/* Add Member Form */}
          {showAddMember && activeLeague === 'family' && (
            <div className={styles.addMemberForm}>
              <form onSubmit={handleAddMember}>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={styles.phoneInput}
                />
                <button type="submit" className={styles.addButton}>
                  Add Member
                </button>
              </form>
            </div>
          )}

          {/* Leaderboard */}
          <div className={styles.leaderboard}>
            {currentMembers
              .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
              .map((member, index) => (
                <div key={member.id} className={styles.leaderboardItem}>
                  <div className={styles.rank}>{index + 1}</div>
                  <img src={member.avatar} alt={member.name} className={styles.avatar} />
                  <div className={styles.memberInfo}>
                    <div className={styles.name}>{member.name}</div>
                    <div className={styles.stats}>
                      <span className={styles.accuracy}>{timeframe === 'weekly' ? member.weeklyAccuracy : member.accuracy}% accuracy</span>
                      <span className={styles.challenges}>{timeframe === 'weekly' ? member.weeklyChallengesCompleted : member.challengesCompleted} challenges</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className={styles.challengesSection}>
          <h2>Active Challenges</h2>
          <div className={styles.challengesList}>
            {leagueData.challenges[timeframe].map(challenge => (
              <div key={challenge.id} className={styles.challengeCard}>
                <div className={styles.challengeInfo}>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <div className={styles.progressText}>{challenge.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
