import React from 'react';
import ShieldIcon from './icons/ShieldIcon';

interface TermsAgreementProps {
  onContinue: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onContinue }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md sm:max-w-lg text-center transform transition-all duration-500 hover:shadow-3xl flex flex-col items-center">
      <ShieldIcon className="w-24 h-24 mb-6 text-blue-500" />
      <p className="text-gray-900 mb-8">
        By continuing, you agree to <span className="font-semibold">Sereinsoul</span>{' '}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          Privacy Policy
        </a>
        .
      </p>
      <button
        onClick={onContinue}
        className="w-full max-w-xs bg-blue-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
      >
        Continue
      </button>
    </div>
  );
};

export default TermsAgreement;