import React, { useState } from 'react';
import SignInForm from '../components/SignInForm';
import OtpForm from '../components/OtpForm';
import TermsAgreement from '../components/TermsAgreement';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface SignInPageProps {
  onSignInSuccess: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSignInSuccess }) => {
  const [step, setStep] = useState<'signIn' | 'otp' | 'terms'>('signIn');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleOtpSent = (number: string) => {
    setMobileNumber(number);
    setStep('otp');
  };
  
  const handleVerify = () => {
    console.log('OTP Verified! Proceeding to terms.');
    setStep('terms');
  };
  
  const handleContinue = () => {
    console.log('Terms Agreed! Welcome!');
    alert('Sign in successful!');
    onSignInSuccess();
  }

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
        </div>
    </div>
  );
};

export default SignInPage;