import React, { useState } from 'react';
import OtpIcon from './icons/OtpIcon';

interface OtpFormProps {
  mobileNumber: string;
  onVerify: () => void;
  onBack: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ mobileNumber, onVerify, onBack }) => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setOtp(e.target.value.replace(/\D/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setError(null);
    // Use the VITE_API_URL defined in App.tsx context or .env
    const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
    try {
      const res = await fetch(`${apiBase}/api/auth/otp/verify`, { // Corrected endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: `+91${mobileNumber}`, code: otp }) // Backend expects 'code'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Invalid or expired OTP');
      }

      const data = await res.json();
      // Pass the received token back through the onVerify function
      onVerify(data.token); // MODIFIED LINE

    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl px-8 sm:px-12 py-12 sm:py-16 w-full max-w-sm transform transition-all duration-500 hover:shadow-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
        <OtpIcon className="w-10 h-10 text-blue-500" />
        <h1 className="text-3xl font-bold text-blue-500">OTP Verification</h1>
        <p className="text-gray-500 -mt-2">
          Enter the OTP sent to <span className="font-semibold text-gray-700">+91-{mobileNumber}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-8" noValidate>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <div className={`flex items-center border ${error ? 'border-red-500' : 'border-gray-200'} rounded-xl focus-within:ring-2 ${error ? 'focus-within:ring-red-400' : 'focus-within:ring-blue-400'} focus-within:border-transparent transition-all bg-white shadow-sm`}>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              className="w-full py-3 px-4 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-center text-lg tracking-[0.5em]"
              required
              aria-invalid={!!error}
              aria-describedby="otp-error"
              autoComplete="one-time-code"
            />
          </div>
           {error && <p id="otp-error" className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          Verify & Proceed
        </button>
      </form>

      <div className="text-center mt-6 text-sm">
        <p className="text-gray-500">
          Didn't receive code?{' '}
          <button
            type="button"
            className="font-semibold text-blue-500 hover:underline"
            onClick={async () => {
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
                  throw new Error(msg || 'Failed to resend OTP');
                }
              } catch (err: any) {
                setError(err?.message || 'Failed to resend OTP');
              }
            }}
          >
            Resend OTP
          </button>
        </p>
        <button onClick={onBack} className="mt-4 font-semibold text-gray-600 hover:underline">
          &larr; Back to mobile number
        </button>
      </div>
    </div>
  );
};

export default OtpForm;