import React from 'react';

const OtpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="4" y="4" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M19 14H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M19 20H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M19 26H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 14V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default OtpIcon;