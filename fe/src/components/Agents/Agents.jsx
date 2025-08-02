import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Agents.module.css';

const Agents = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
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

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    if (agent.name === "Planetary weight") {
      navigate('/game/planetary-weight');
    }
    else if (agent.name === "Words Connect") {
      navigate('/game/wordsconnect');
    }
  };

  const agents = [
    {
      name: "Words Connect",
      speciality: "Vocabulary, Critical Thinking, Creative Problem Solving",
      logo: "https://mnemo-assets.s3.ap-south-1.amazonaws.com/wordsconnect.webp"
    },
    {
      name: "Riddlon",
      speciality: "Reasoning, Creative Problem Solving, Critical Thinking",
      logo: "https://mnemo-assets.s3.ap-south-1.amazonaws.com/riddlon.webp"
    },
    {
      name: "Planetary weight",
      speciality: "Exploration, Problem Solving, Numerical Reasoning",
      logo: "https://mnemo-assets.s3.ap-south-1.amazonaws.com/planetaryweight.webp"
    },
  ];

  return (
    <section className={styles.agentstop}>
      <h2>Example Games</h2>
      <section id="agents" className={styles.agents} ref={sectionRef}>
        <div className={styles.agentGrid}>
          {agents.map((agent, index) => (
            <div
              key={index}
              className={`${styles.agentCard} ${isVisible ? styles.visible : ''}`}
              style={{
                '--animation-order': index
              }}
              onClick={() => handleAgentClick(agent)}
            >
              <img src={agent.logo} alt={agent.name} style={{ width: '100%', height: 'auto', opacity: 0.9, marginBottom: '1rem'}}/>
              <h3>{agent.name}</h3>
              <div className={styles.speciality}>
                <span className={styles.value}>{agent.speciality}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Agents;
