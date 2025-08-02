import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import styles from './OnboardingFlow.module.css';
import StepBasicInfo from './StepBasicInfo';
import StepBehavioral from './StepBehavioral';

const steps = ['Basic Information', 'Behavioral Assessment'];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { mobileNumber, updateOnboardingData } = useOnboarding();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {},
    behavioral: {}
  });

  // Redirect to mobile input if no mobile number is present
  useEffect(() => {
    if (!mobileNumber) {
      navigate('/parent/mobile');
    }
  }, [mobileNumber, navigate]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      console.log('Complete data:', formData);
      // Create complete data without mobile number
      const completeData = {
        ...formData
      };

      // Save complete data using context
      updateOnboardingData(completeData);

      // Try to save to backend, but proceed regardless
      try {
        await fetch('/api/save-onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(completeData),
        });
      } catch (error) {
        console.error('Error saving onboarding data to backend:', error);
      }

      // Navigate to dashboard regardless of API result
      navigate('/parent/tracking');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/parent/mobile');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleBasicInfoSubmit = (data) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: data
    }));
    handleNext();
  };

  const handleBehavioralSubmit = (data) => {
    setFormData(prev => ({
      ...prev,
      behavioral: data
    }));
    handleNext();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.stepper}>
          {steps.map((label, index) => (
            <div
              key={label}
              className={`${styles.step} ${
                index === activeStep ? styles.stepActive : ''
              } ${index < activeStep ? styles.stepCompleted : ''}`}
            >
              <div className={styles.stepCircle}></div>
              <div className={styles.stepLabel}>{label}</div>
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {activeStep === 0 && (
            <StepBasicInfo 
              onSubmit={handleBasicInfoSubmit}
              initialData={formData.basicInfo}
            />
          )}
          {activeStep === 1 && (
            <StepBehavioral 
              onSubmit={handleBehavioralSubmit}
              initialData={formData.behavioral}
            />
          )}
        </div>

        {/* <div className={styles.buttonContainer}>
          {activeStep > 0 && (
            <button
              onClick={handleBack}
              className={`${styles.button} ${styles.buttonBack}`}
            >
              Back
            </button>
          )}
          {activeStep === 1 && (
            <button
              onClick={handleBehavioralSubmit}
              className={`${styles.button} ${styles.buttonNext}`}
            >
              Complete
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default OnboardingFlow;
