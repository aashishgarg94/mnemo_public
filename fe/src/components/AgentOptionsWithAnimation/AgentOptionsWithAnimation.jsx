import React, { useState } from 'react';
import styles from './AgentOptionsWithAnimation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faFileAlt, faLightbulb } from '@fortawesome/free-regular-svg-icons';

const AgentOptionsWithAnimation = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      id: 'explore',
      title: 'Run a Virtual Business',
      description: 'Master decision-making, executive functions, and problem-solving in real-world scenarios',
      icon: <FontAwesomeIcon icon={faChartBar} style={{ color: '#FF7EB3' }} />, // Chart line for business
      position: 'topLeft'
    },
    {
      id: 'complete',
      title: 'Step Into History',
      description: 'Take on exciting missions inspired by the lives of iconic historical figures',
      icon: <FontAwesomeIcon icon={faFileAlt} style={{ color: '#FF7EB3' }} />, // Scroll for history
      position: 'bottomCenter'
    },
    {
      id: 'track',
      title: 'Conquer Skill Challenges',
      description: 'Complete quests individually or in teams to foster learning and social skills',
      icon: <FontAwesomeIcon icon={faLightbulb} style={{ color: '#FF7EB3' }} />, // Shield for adventure
      position: 'topRight'
    }
  ];
  

  const handleOptionClick = (optionId) => {
    setSelectedOption(selectedOption === optionId ? null : optionId);
  };

  return (
    <section id="agentOptions" className={styles.agentOptions}>
      <h2>Explore, Learn and Grow</h2>
    <div className={styles.container}>
      {/* Central Animation */}
      <div className={styles.centralAnimation}>
        <div className={styles.orb}>
          <div className={styles.orbCore}></div>
          <div className={styles.orbRing}></div>
        </div>
      </div>

      {/* Options */}
      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <div
            key={option.id}
            className={`${styles.option} ${styles[option.position]} ${
              selectedOption === option.id ? styles.selected : ''
            }`}
            onClick={() => handleOptionClick(option.id)}
          >
            <div className={styles.optionContent}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{option.icon}</span>
              </div>
              <h3>{option.title}</h3>
              <p style={{fontSize: '0.8rem'}}>{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default AgentOptionsWithAnimation;
