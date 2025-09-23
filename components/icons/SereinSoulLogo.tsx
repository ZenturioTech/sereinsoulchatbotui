import React from 'react';

const SereinSoulLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="images/logo.png"
      alt="SereinSoul Logo"
      className={className}
    />
  );
};

export default SereinSoulLogo;
