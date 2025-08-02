import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import './MobileInput.css';

const MobileInput = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { updateMobileNumber, updateOnboardingData } = useOnboarding();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Mobile Number:', mobileNumber);
            // For development, simulate API response since backend is not ready
            // Uncomment this when backend is ready
            /*
            const response = await fetch('/api/check-mobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify mobile number');
            }
            */

            // Store mobile number only in context
            updateMobileNumber(mobileNumber);
            
            // Initialize empty onboarding data
            updateOnboardingData({
                basicInfo: {},
                behavioral: {}
            });
            
            // Proceed to onboarding flow
            navigate('/parent');
            
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mobile-input-container">
            <div className="mobile-input-overlay">
                <div className="mobile-input-box">
                    <h2>Welcome!</h2>
                    <p>Please enter your mobile number to begin</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="Enter mobile number"
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Please wait...' : 'Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MobileInput;
