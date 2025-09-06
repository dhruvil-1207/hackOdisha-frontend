import React from 'react';
import { FaCircle } from 'react-icons/fa';

const TypingIndicator = ({ users = [], className = '' }) => {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`;
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing...`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
      <div className="flex space-x-1">
        <FaCircle className="h-2 w-2 text-indigo-500 animate-pulse" />
        <FaCircle className="h-2 w-2 text-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <FaCircle className="h-2 w-2 text-indigo-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
