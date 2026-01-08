import React from 'react';

export const Card = ({ 
  children, 
  className = '',
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-xl shadow-sm
        ${hover ? 'transition-all duration-200 hover:shadow-lg hover:border-blue-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);
