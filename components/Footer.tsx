
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-6 md:py-6 flex justify-center items-center">
      <div className="flex gap-8 text-gray-500">
        <a href="#" className="hover:text-blue-600 hover:underline">
          Terms & Conditions
        </a>
        <a href="#" className="hover:text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
