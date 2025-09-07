import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaComments, FaClock, FaLock, FaGlobe, FaStar } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const RoomCard = ({ room, showActions = false, onJoin, onLeave, onDelete }) => {
  const {
    id,
    name,
    description,
    memberCount = 0,
    postCount = 0,
    isPrivate = false,
    isJoined = false,
    isOwner = false,
    createdAt,
    lastActivity,
    tags = [],
    inviteCode
  } = room;

  const handleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onJoin) onJoin(room);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLeave) onLeave(room);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(room);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <Link to={`/rooms/${id}`} className="block">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {name}
                </h3>
                {isPrivate ? (
                  <FaLock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                ) : (
                  <FaGlobe className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                {isOwner && (
                  <FaStar className="h-4 w-4 text-yellow-500 flex-shrink-0" title="You own this room" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <FaUsers className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComments className="h-4 w-4" />
              <span>{postCount} posts</span>
            </div>
            {lastActivity && (
              <div className="flex items-center space-x-1">
                <FaClock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          {/* Created Date */}
          {createdAt && (
            <div className="text-xs text-gray-400">
              Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isJoined ? (
                <button
                  onClick={handleLeave}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Leave Room
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Join Room
                </button>
              )}
              
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            
            {inviteCode && (
              <div className="text-xs text-gray-500">
                Code: <span className="font-mono font-medium">{inviteCode}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;

