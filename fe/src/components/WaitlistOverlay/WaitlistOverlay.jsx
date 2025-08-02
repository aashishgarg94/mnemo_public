import React, { useState } from 'react';
import axios from 'axios';
import styles from './WaitlistOverlay.module.css';

const WaitlistOverlay = ({ isOpen, onClose, title = "Join the Waitlist", description = "Be the first to experience the future of AI battles" }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = 'https://tech.mnemokids.com';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      console.log('email', email);
      setIsLoading(true);
      await axios.post(`${BASE_URL}/users/add?username=${email}`);
      console.log('success');
      setSuccess('Thank you for joining the waitlist!');
      setEmail('');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{title}</h2>
        <p>{description}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Joining...' : 'Join'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaitlistOverlay;