import React from 'react';
import SereinSoulLogo from './icons/SereinSoulLogo';

interface HeaderProps {
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onSignInClick, onSignOut }) => {
  return (
    <header className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <SereinSoulLogo className="w-54 md:w-96 h-auto" />
      </div>
      {isAuthenticated ? (
        <button
          onClick={onSignOut}
          className="bg-gray-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors shadow-md text-base md:text-lg whitespace-nowrap"
        >
          Sign Out
        </button>

      ) : (
        <button 
          onClick={onSignInClick}
          className="bg-blue-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-[#0069D9] transition-colors shadow-md text-base md:text-lg">
          Login/SignUp
        </button>
      )}
    </header>
  );
};

export default Header;