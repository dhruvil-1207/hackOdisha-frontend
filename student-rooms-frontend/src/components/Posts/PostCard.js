import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaThumbtack, FaEllipsisV, FaEdit, FaTrash, FaUser, FaClock, FaPaperclip } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { postsService } from '../../services/posts';
import toast from 'react-hot-toast';

const PostCard = ({ 
  post, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onLike, 
  onComment,
  className = '' 
}) => {
  const {
    id,
    title,
    content,
    author,
    createdAt,
    updatedAt,
    likes = 0,
    comments = 0,
    isLiked = false,
    isPinned = false,
    isOwner = false,
    attachments = [],
    type = 'note'
  } = post;

  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await postsService.unlikePost(id);
        if (onLike) onLike(id, false);
      } else {
        await postsService.likePost(id);
        if (onLike) onLike(id, true);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handlePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isPinned) {
        await postsService.unpinPost(id);
      } else {
        await postsService.pinPost(id);
      }
      toast.success(isPinned ? 'Post unpinned' : 'Post pinned');
    } catch (error) {
      toast.error(error.message || 'Failed to update pin status');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(post);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(post);
  };

  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onComment) onComment(post);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-red-100 text-red-800';
      case 'topic':
        return 'bg-blue-100 text-blue-800';
      case 'note':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'topic':
        return '💬';
      case 'note':
      default:
        return '📝';
    }
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
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {author?.name || 'Unknown User'}
                </h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                  {getTypeIcon(type)} {type}
                </span>
                {isPinned && (
                  <FaThumbtack className="h-3 w-3 text-yellow-500" title="Pinned post" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <FaClock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </span>
                {updatedAt !== createdAt && (
                  <span>(edited)</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && (isOwner || isPinned) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaEllipsisV className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  {isOwner && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaEdit className="h-4 w-4 mr-2" />
                        Edit Post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <FaTrash className="h-4 w-4 mr-2" />
                        Delete Post
                      </button>
                    </>
                  )}
                  {isPinned && (
                    <button
                      onClick={handlePin}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FaThumbtack className="h-4 w-4 mr-2" />
                      {isPinned ? 'Unpin Post' : 'Pin Post'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <FaPaperclip className="h-4 w-4" />
              <span>{attachments.length} attachment{attachments.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="text-xs text-gray-600 truncate">
                    {attachment.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

          {isPinned && (
            <div className="flex items-center space-x-1 text-xs text-yellow-600">
              <FaThumbtack className="h-3 w-3" />
              <span>Pinned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
