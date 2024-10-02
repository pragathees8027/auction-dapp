import React from 'react';

const Tooltip = ({ children, tooltip, position }) => {
  return (
    <div className="relative inline-block group">
      {children}
    {position == 'top' && (
      <span className="absolute bg-blue-500 left-1/2 transform -translate-x-1/2 bottom-full mb-3 w-48 text-center p-2 text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tooltip-top">
        {tooltip}
      </span>
    )}

    {(position == 'bottom' || position == null) && (
      <span className="absolute bg-blue-500 left-1/2 transform -translate-x-1/2 translate-y-1 top-full mt-2 w-48 text-center p-2 text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tooltip-bottom">
        {tooltip}
      </span>
    )}

    {position === 'left' && (
      <span className="absolute bg-blue-500 right-full transform -translate-y-1/2 translate-x-1 top-1/2 mr-4 w-48 text-center p-2 text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tooltip-left">
        {tooltip}
      </span>
    )}

    {position === 'right' && (
      <span className="absolute bg-blue-500 left-full transform -translate-y-1/2 translate-x-1 top-1/2 ml-2 w-48 text-center p-2 text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tooltip-right">
        {tooltip}
      </span>
    )}
    </div>
  );
};

export default Tooltip;
