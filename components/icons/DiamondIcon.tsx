import React from 'react';

const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}
    >
        <path d="M12.0001 23.3137L23.3138 12.0001L12.0001 0.686279L0.686295 12.0001L12.0001 23.3137Z"/>
    </svg>
);

export default DiamondIcon;