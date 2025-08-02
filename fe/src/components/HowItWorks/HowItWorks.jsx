import React from 'react';
import styles from './HowItWorks.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faSmile, faComments } from '@fortawesome/free-regular-svg-icons';
import { faS } from '@fortawesome/free-solid-svg-icons';

const HowItWorks = () => {
  // const steps = [
  //     {
  //       title: 'Higher Order Cognition',
  //       description: 'Problem Solving, Critical Thinking, and Creative Expression',
  //       icon: '🧠',
  //       background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
  //     },
  //     {
  //       title: 'Socio-Emotional Learning',
  //       description: 'Designed to foster empathy, patience, and resilience',
  //       icon: '👥',
  //       background: "linear-gradient(135deg, #050d18 0%, #380935 100%)"
  //     },
  //     {
  //       title: 'Safe, Responsible Gaming',
  //       description: 'A level playing field for every child—no in-app purchases or hidden costs',
  //       icon: '🛡️',
  //       background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  //     }
  // ];
  const steps = [
    {
      title: 'Confident, Lifelong Learners',
      description: "Inspire a love for learning and equip your child with adaptable skills for the future",
      icon: faLightbulb
    },
    {
      title: 'Socio-Emotional Learning',
      description: 'Designed to foster empathy, patience, and resilience',
      icon: faSmile
    },
    {
      title: 'Collaborative Learning',
      description: 'Encourages teamwork, communication, and shared problem-solving with friends',
      icon: faComments
    }
  ];
  return (
    <section id="howItWorks" className={styles.howItWorks}>
      <h1>Parent Approved, Kid Loved</h1>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.iconContainer}>
              <FontAwesomeIcon icon={step.icon} style={{ color: '#FF7EB3', fontSize: '2rem' }} />
            </div>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
