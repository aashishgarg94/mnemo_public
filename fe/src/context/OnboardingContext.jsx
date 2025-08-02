import React, { createContext, useState, useContext, useCallback } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState(() => {
        try {
            const data = localStorage.getItem('onboardingData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading initial onboarding data:', error);
            return null;
        }
    });

    const [mobileNumber, setMobileNumber] = useState(() => {
        try {
            return localStorage.getItem('mobileNumber') || null;
        } catch (error) {
            console.error('Error loading mobile number:', error);
            return null;
        }
    });

    const updateMobileNumber = useCallback((number) => {
        try {
            if (number) {
                localStorage.setItem('mobileNumber', number);
            } else {
                localStorage.removeItem('mobileNumber');
            }
            setMobileNumber(number);
        } catch (error) {
            console.error('Error saving mobile number:', error);
        }
    }, []);

    const updateOnboardingData = useCallback((data) => {
        try {
            console.log('Updating onboarding data:', data);
            if (data) {
                // Remove mobile from basicInfo if it exists
                if (data.basicInfo && 'mobile' in data.basicInfo) {
                    const { mobile, ...restBasicInfo } = data.basicInfo;
                    data = {
                        ...data,
                        basicInfo: restBasicInfo
                    };
                }
                localStorage.setItem('onboardingData', JSON.stringify(data));
            } else {
                localStorage.removeItem('onboardingData');
            }
            setOnboardingData(data);
        } catch (error) {
            console.error('Error saving onboarding data:', error);
        }
    }, []);

    const clearOnboardingData = useCallback(() => {
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('mobileNumber');
        setOnboardingData(null);
        setMobileNumber(null);
    }, []);

    const hasValidOnboardingData = useCallback(() => {
        console.log('onboardingData:', onboardingData);
        if (!onboardingData) return false;
        
        // Check basicInfo exists and has required fields
        const hasValidBasicInfo = onboardingData.basicInfo && 
            typeof onboardingData.basicInfo === 'object' &&
            'name' in onboardingData.basicInfo &&
            'age' in onboardingData.basicInfo &&
            'grade' in onboardingData.basicInfo;

        return hasValidBasicInfo;
    }, [onboardingData]);

    const hasMobileNumber = useCallback(() => {
        return Boolean(mobileNumber);
    }, [mobileNumber]);

    return (
        <OnboardingContext.Provider 
            value={{
                onboardingData,
                mobileNumber,
                updateMobileNumber,
                updateOnboardingData,
                clearOnboardingData,
                hasValidOnboardingData,
                hasMobileNumber
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
