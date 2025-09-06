import React from 'react';
import { FaCircle, FaUsers } from 'react-icons/fa';

const OnlineUsers = ({ users = [], maxDisplay = 5, className = '' }) => {
  if (users.length === 0) return null;

  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <FaUsers className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-600">
        {users.length} online
      </span>
      
      <div className="flex -space-x-2">
        {displayUsers.map((user, index) => (
          <div
            key={user.id}
            className="relative"
            title={user.name}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-indigo-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white">
              <FaCircle className="h-full w-full text-green-500" />
            </div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
            <span className="text-xs font-medium text-gray-600">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
