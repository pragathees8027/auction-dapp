import React from 'react';

const Tooltip = ({ children, text }) => {
  return (
    <div className="relative inline-block group">
      {children}
      <span className="absolute tooltip left-1/2 transform -translate-x-1/2 top-full mt-2 w-48 text-center p-2 text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
