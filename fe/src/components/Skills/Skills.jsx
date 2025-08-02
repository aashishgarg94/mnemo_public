import React, { useEffect, useRef } from 'react';
import styles from './Skills.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faGem, faStar, faUser } from '@fortawesome/free-regular-svg-icons';

const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // const skills = [
  //   {
  //     name: 'Problem Solving',
  //     icon: '🧩'
  //   },
  //   {
  //     name: 'Critical Thinking',
  //     icon: '🤔'
  //   },
  //   {
  //     name: 'Metacognition',
  //     icon: '🧠'
  //   },
  //   {
  //     name: 'Decision Making',
  //     icon: '⚖️'
  //   },
  //   {
  //     name: 'Strategic Thinking',
  //     icon: '♟️'
  //   },
  //   {
  //     name: 'Creativity',
  //     icon: '🎨'
  //   }
  // ];


  const skills = [
    {
      name: 'For the Explorer',
      subtitle: 'Open world RPG set in real life locations',
      icon: faMap
    },
    {
      name: 'For the Achiever',
      subtitle: 'Immersive skill building challenges',
      icon: faGem
    },
    {
      name: 'For the Competitor',
      subtitle: 'School and Peer mini leagues',
      icon: faStar
    }
    // {
    //   name: 'For the Socializer',
    //   subtitle: 'Multiplayer team play with friends',
    //   icon: faUser
    // }
  ];
  return (
    <section className={styles.skills} ref={sectionRef}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h2>
            <span className={styles.highlight}>Unique Experiences</span>
            <br />
            for Every Child
          </h2>
          <p className={styles.description}>
            Learning style, interests and pace and unique to every child. Our platform is designed to cater to every child's personal learning journey.
          </p>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.skillsList}>
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className={styles.skillItem}
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={styles.skillIcon}><FontAwesomeIcon icon={skill.icon} style={{fontSize: '2rem', color: '#FF7EB3'}}/></div>
                <div className={styles.skillContent}>
                  <h3>{skill.name}</h3>
                  <p>{skill.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
