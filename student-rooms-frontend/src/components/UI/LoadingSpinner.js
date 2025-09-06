import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'indigo', 
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    indigo: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <FaSpinner 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      />
      {text && (
        <p className={`text-sm ${colorClasses[color]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
