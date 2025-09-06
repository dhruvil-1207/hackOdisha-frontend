import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaEllipsisV, FaEdit, FaTrash, FaUser, FaClock, FaExclamationTriangle, FaCheckCircle, FaLock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { doubtsService } from '../../services/doubts';
import toast from 'react-hot-toast';

const DoubtCard = ({ 
  doubt, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onComment,
  onLike,
  onMarkUrgent,
  onClose,
  onReopen,
  className = '' 
}) => {
  const {
    id,
    title,
    description,
    author,
    createdAt,
    updatedAt,
    likes = 0,
    comments = 0,
    isLiked = false,
    isUrgent = false,
    isClosed = false,
    isOwner = false,
    tags = []
  } = doubt;

  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await doubtsService.unlikeDoubt(id);
        if (onLike) onLike(id, false);
      } else {
        await doubtsService.likeDoubt(id);
        if (onLike) onLike(id, true);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleMarkUrgent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isUrgent) {
        await doubtsService.unmarkAsUrgent(id);
      } else {
        await doubtsService.markAsUrgent(id);
      }
      toast.success(isUrgent ? 'Unmarked as urgent' : 'Marked as urgent');
    } catch (error) {
      toast.error(error.message || 'Failed to update urgent status');
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await doubtsService.closeDoubt(id);
      toast.success('Doubt closed');
      if (onClose) onClose(id);
    } catch (error) {
      toast.error(error.message || 'Failed to close doubt');
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await doubtsService.reopenDoubt(id);
      toast.success('Doubt reopened');
      if (onReopen) onReopen(id);
    } catch (error) {
      toast.error(error.message || 'Failed to reopen doubt');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(doubt);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(doubt);
  };

  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onComment) onComment(doubt);
  };

  const getStatusColor = () => {
    if (isClosed) return 'bg-gray-100 text-gray-800';
    if (isUrgent) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (isClosed) return 'Closed';
    if (isUrgent) return 'Urgent';
    return 'Open';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="h-5 w-5 text-indigo-600" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {isUrgent && <FaExclamationTriangle className="h-3 w-3 mr-1" />}
                  {isClosed && <FaLock className="h-3 w-3 mr-1" />}
                  {getStatusText()}
                </span>
                {isOwner && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Your Question
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <span>{author?.name || 'Unknown User'}</span>
                <span>•</span>
                <FaClock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </span>
                {updatedAt !== createdAt && (
                  <span>(edited)</span>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaEllipsisV className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaEdit className="h-4 w-4 mr-2" />
                    Edit Doubt
                  </button>
                  <button
                    onClick={isUrgent ? handleMarkUrgent : handleMarkUrgent}
                    className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full text-left"
                  >
                    <FaExclamationTriangle className="h-4 w-4 mr-2" />
                    {isUrgent ? 'Unmark as Urgent' : 'Mark as Urgent'}
                  </button>
                  {isClosed ? (
                    <button
                      onClick={handleReopen}
                      className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                    >
                      <FaCheckCircle className="h-4 w-4 mr-2" />
                      Reopen
                    </button>
                  ) : (
                    <button
                      onClick={handleClose}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 w-full text-left"
                    >
                      <FaLock className="h-4 w-4 mr-2" />
                      Close
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FaTrash className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-wrap">{description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isLiked
                  ? 'text-indigo-600 hover:text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } disabled:opacity-50`}
            >
              <FaThumbsUp className={`h-4 w-4 ${isLiked ? 'text-indigo-600' : ''}`} />
              <span>{likes}</span>
            </button>
            
            <button
              onClick={handleComment}
              className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaComment className="h-4 w-4" />
              <span>{comments}</span>
            </button>
          </div>

          {/* Status Actions */}
          {showActions && !isOwner && (
            <div className="flex items-center space-x-2">
              {!isUrgent && (
                <button
                  onClick={handleMarkUrgent}
                  className="flex items-center space-x-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <FaExclamationTriangle className="h-4 w-4" />
                  <span>Mark Urgent</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;
