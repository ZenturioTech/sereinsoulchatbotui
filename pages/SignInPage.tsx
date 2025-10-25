import React, { useState } from 'react';
import SignInForm from '../components/SignInForm';
import OtpForm from '../components/OtpForm';
import TermsAgreement from '../components/TermsAgreement';
import DetailsForm from '../components/DetailsForm'; 
import { AnimatePresence, motion } from 'framer-motion';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface SignInPageProps {
  onSignInSuccess: (token: string) => void;
}const formVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const formTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};



const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const SignInPage: React.FC<SignInPageProps> = ({ onSignInSuccess, onAdminSignInSuccess }) => { // <-- Add new prop
  const [step, setStep] = useState<'signIn' | 'otp' | 'terms' | 'details'>('signIn');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false); // <-- NEW: State to track admin status

  const handleOtpSent = (number: string) => {
    setMobileNumber(number);
    setStep('otp'); // This should change the view to OtpForm
  };
  // --- MODIFIED: handleVerify ---
  const handleVerify = (token: string, isAdmin: boolean) => { // Receive isAdmin flag
    console.log(`OTP Verified! Admin: ${isAdmin}. Storing token.`);
    localStorage.setItem('authToken', token);
    localStorage.setItem('phoneNumber', `+91${mobileNumber}`);
    setIsAdminLogin(isAdmin); // Store admin status

    // Decide next step based on admin status
    if (isAdmin) {
      console.log("Admin user detected, skipping terms/details, calling onAdminSignInSuccess.");
      onAdminSignInSuccess(token); // Redirect admin immediately
    } else {
      console.log("Regular user, proceeding to terms.");
      setStep('terms'); // Regular users go to terms
    }
  };
  // -----------------------------
  
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

    console.log("Attempting to send GATEKEEPER_API_KEY:", GATEKEEPER_API_KEY);

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

  let formComponent;
  if (step === 'signIn') {
    formComponent = (
      <motion.div key="signIn" variants={formVariants} initial="initial" animate="in" exit="out" transition={formTransition}>
        <SignInForm onOtpSent={handleOtpSent} />
      </motion.div>
    );
  } else if (step === 'otp') {
    formComponent = (
      <motion.div key="otp" variants={formVariants} initial="initial" animate="in" exit="out" transition={formTransition}>
        <OtpForm mobileNumber={mobileNumber} onVerify={handleVerify} onBack={handleBack} />
      </motion.div>
    );
  } else if (step === 'terms') {
    formComponent = (
      <motion.div key="terms" variants={formVariants} initial="initial" animate="in" exit="out" transition={formTransition}>
        <TermsAgreement onContinue={handleContinue} />
      </motion.div>
    );
  } else if (step === 'details') {
    formComponent = (
      <motion.div key="details" variants={formVariants} initial="initial" animate="in" exit="out" transition={formTransition}>
        <DetailsForm onSubmit={handleDetailsSubmit} />
      </motion.div>
    );
  }

  return (
    <div 
        className="min-h-screen bg-white flex items-center justify-center p-4..."
        role="main"
    >
        <SereinSoulLogo className="absolute top-8 left-8 w-40 md:w-64 h-auto" />
        <div className="transition-all duration-300 w-full max-w-lg">
            <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {formComponent}
          </AnimatePresence>
        </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    </div>
  );
};

export default SignInPage;