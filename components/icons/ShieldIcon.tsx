import React from 'react';

const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="50" fill="#4285F4" />
        <path 
            d="M50 15L85 30V55C85 75 70 90 50 90C30 90 15 75 15 55V30L50 15Z" 
            fill="white"
        />
        <g fill="#4285F4">
            <path d="M47 65H53V45H47V65Z" />
            <circle cx="50" cy="35" r="4" />
        </g>
    </svg>
);

export default ShieldIcon;