import React, { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      question: "How does this game help children?",
      answer: "Our platform focuses on fostering an interest in learning and imparting transferrable skills to grow confident children ready for the 21st century. Additionally, it nurtures social-emotional learning (SEL) skills such as empathy, collaboration, and resilience."
    },
    {
      question: "Is this game safe for my child to play online?",
      answer: "Yes! Safety is our top priority. We provide a secure online environment with no ads, hidden costs, or in-game purchases. Our multiplayer features are designed for cooperative play with AI or approved friends, ensuring a positive and supportive experience."
    },
    {
      question: "How does the game measure my child's progress?",
      answer: "The game tracks skill development using diverse metrics tied to milestones and achievements. Parents receive detailed insights through a Passport of Growth, which highlights measurable improvements."
    },
    {
      question: "What makes this different from other educational apps or games?",
      answer: "Unlike traditional educational apps, our open-world RPG combines immersive storytelling, exploration, and personalized adaptive learning. It’s designed to engage kids in meaningful play while fostering real-world skills—balancing fun with measurable growth."
    },
    {
      question: "How can Mnemo help find what skills and interest my child has?",
      answer: "Mnemo helps parents identify their child’s unique learning style, interests, and pace through a personalized learning journey. These skills can be mapped to potential career opportunities and guidance as to what's next is available on the parent app."
    }
  ];  

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faq}>
      <h2>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`${styles.faqItem} ${activeQuestion === index ? styles.active : ''}`}
            onClick={() => toggleQuestion(index)}
          >
            <div className={styles.question}>
              <h4>{faq.question}</h4>
              <span className={styles.arrow}>▼</span>
            </div>
            <div className={styles.answer}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
