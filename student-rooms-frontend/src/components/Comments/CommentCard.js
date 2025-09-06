import React, { useState } from 'react';
import { FaThumbsUp, FaReply, FaEllipsisV, FaEdit, FaTrash, FaUser, FaClock, FaCheckCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { commentsService } from '../../services/comments';
import toast from 'react-hot-toast';

const CommentCard = ({ 
  comment, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onReply,
  onLike,
  onMarkSolution,
  className = '' 
}) => {
  const {
    id,
    content,
    author,
    createdAt,
    updatedAt,
    likes = 0,
    isLiked = false,
    isSolution = false,
    isOwner = false,
    replies = [],
    parentId
  } = comment;

  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await commentsService.unlikeComment(id);
        if (onLike) onLike(id, false);
      } else {
        await commentsService.likeComment(id);
        if (onLike) onLike(id, true);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleMarkSolution = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isSolution) {
        await commentsService.unmarkAsSolution(id);
      } else {
        await commentsService.markAsSolution(id);
      }
      toast.success(isSolution ? 'Unmarked as solution' : 'Marked as solution');
      if (onMarkSolution) onMarkSolution(id, !isSolution);
    } catch (error) {
      toast.error(error.message || 'Failed to update solution status');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(comment);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(comment);
  };

  const handleReply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReply) onReply(comment);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Comment Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <FaUser className="h-4 w-4 text-indigo-600" />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900">
                {author?.name || 'Unknown User'}
              </h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <FaClock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </span>
                {updatedAt !== createdAt && (
                  <span>(edited)</span>
                )}
              </div>
              {isSolution && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <FaCheckCircle className="h-3 w-3" />
                  <span>Solution</span>
                </div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{content}</p>
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
                    Edit Comment
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FaTrash className="h-4 w-4 mr-2" />
                    Delete Comment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
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
              onClick={handleReply}
              className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaReply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Solution Button */}
          {showActions && !isSolution && (
            <button
              onClick={handleMarkSolution}
              className="flex items-center space-x-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              <FaCheckCircle className="h-4 w-4" />
              <span>Mark as Solution</span>
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {showReplies ? 'Hide' : 'Show'} {replies.length} repl{replies.length !== 1 ? 'ies' : 'y'}
          </button>
          
          {showReplies && (
            <div className="px-4 pb-4 space-y-3">
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  showActions={showActions}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  onLike={onLike}
                  onMarkSolution={onMarkSolution}
                  className="ml-4 border-l-2 border-gray-200"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
