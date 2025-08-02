import React, { useState } from 'react';
import styles from './StepBasicInfo.module.css';

const StepBasicInfo = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Child's Name
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Age
              <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={styles.input}
              required
              min="1"
              max="18"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              School Grade
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default StepBasicInfo;
