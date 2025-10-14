import React, { useState } from 'react';
import SignInIcon from './icons/SignInIcon';

interface SignInFormProps {
  onOtpSent: (mobileNumber: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onOtpSent }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      setError(null);
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
      try {
        const res = await fetch(`${apiBase}/api/auth/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: `+91${mobileNumber}` })
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Failed to send OTP');
        }
        onOtpSent(mobileNumber);
      } catch (err: any) {
        setError(err?.message || 'Failed to send OTP');
      }
    } else {
      setError('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setMobileNumber(e.target.value.replace(/\D/g, ''));
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl px-8 sm:px-12 py-12 sm:py-16 w-full max-w-sm transform transition-all duration-500 hover:shadow-3xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-10">
        <SignInIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-blue-500">Sign in</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Mobile number
          </label>
          <div className={`flex items-center border ${error ? 'border-red-500' : 'border-gray-200'} rounded-xl focus-within:ring-2 ${error ? 'focus-within:ring-red-400' : 'focus-within:ring-blue-400'} focus-within:border-transparent transition-all bg-white px-3 shadow-sm`}>
            <span className="text-gray-500 text-base">+91-</span>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              maxLength={10}
              placeholder="XXXXXXXXXX"
              className="w-full py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 ml-2 text-base tracking-wider"
              required
              aria-invalid={!!error}
              aria-describedby="mobile-error"
            />
          </div>
          {error && <p id="mobile-error" className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 mt-2"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default SignInForm;