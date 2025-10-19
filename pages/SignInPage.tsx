import React, { useState } from 'react';
import SignInForm from '../components/SignInForm';
import OtpForm from '../components/OtpForm';
import TermsAgreement from '../components/TermsAgreement';
import DetailsForm from '../components/DetailsForm'; // <-- NEW: Import the details form
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface SignInPageProps {
  onSignInSuccess: (token: string) => void;
}

const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const SignInPage: React.FC<SignInPageProps> = ({ onSignInSuccess }) => {
  // Add 'details' to the possible steps
  const [step, setStep] = useState<'signIn' | 'otp' | 'terms' | 'details'>('signIn');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState(''); // Add error state for API calls

  const handleOtpSent = (number: string) => {
    setMobileNumber(number);
    setStep('otp');
  };
  
  const handleVerify = (token: string) => {
    console.log('OTP Verified! Storing token and proceeding to terms.');
    localStorage.setItem('authToken', token); // Store token immediately
    localStorage.setItem('phoneNumber', `+91${mobileNumber}`);
    setStep('terms');
  };
  
  const handleContinue = () => {
    console.log('Terms Agreed! Proceeding to details form.');
    setStep('details'); // <-- NEW: Go to details form after terms
  }

  // --- NEW: Handler for the details form submission ---
  const handleDetailsSubmit = async (details: { name?: string; age?: number; gender?: string }) => {
    console.log('Submitting user details:', details);
    setError(''); // Clear previous errors
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        setError('Authentication error. Please sign in again.');
        setStep('signIn'); // Go back to login on error
        return;
    }

    try {
        const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBase}/api/user/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-api-key': GATEKEEPER_API_KEY
            },
            body: JSON.stringify(details)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save details.');
        }

        console.log('Details saved successfully! Welcome!');
        onSignInSuccess(token); // Final step: proceed to chat page

    } catch (err: any) {
        console.error('Error submitting details:', err);
        setError(err.message || 'An unexpected error occurred.');
        // Optionally, you can keep the user on the details page to retry
    }
  };
  // ----------------------------------------------------

  const handleBack = () => {
    setStep('signIn');
  };

  return (
    <div 
        className="min-h-screen bg-white flex items-center justify-center p-4 font-sans relative"
        role="main"
    >
        <SereinSoulLogo className="absolute top-8 left-8 w-40 md:w-64 h-auto" />
        <div className="transition-all duration-300 w-full max-w-lg">
            {step === 'signIn' && <SignInForm onOtpSent={handleOtpSent} />}
            {step === 'otp' && <OtpForm mobileNumber={mobileNumber} onVerify={handleVerify} onBack={handleBack} />}
            {step === 'terms' && <TermsAgreement onContinue={handleContinue} />}
            {/* --- NEW: Render the DetailsForm --- */}
            {step === 'details' && <DetailsForm onSubmit={handleDetailsSubmit} />}
            {/* Display error if any API call fails */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    </div>
  );
};

export default SignInPage;