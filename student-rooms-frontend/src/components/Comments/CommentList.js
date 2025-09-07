import React, { useState, useEffect } from 'react';
import { FaComment, FaSort, FaFilter } from 'react-icons/fa';
import CommentCard from './CommentCard';
import CreateCommentForm from './CreateCommentForm';
import LoadingSpinner from '../UI/LoadingSpinner';
import { commentsService } from '../../services/comments';
import toast from 'react-hot-toast';

const CommentList = ({ 
  parentId, 
  comments = [], 
  loading = false, 
  onRefresh,
  showActions = false,
  onEdit,
  onDelete,
  onLike,
  onMarkSolution,
  onReply,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filteredComments, setFilteredComments] = useState([]);

  // Filter and sort comments
  useEffect(() => {
    let filtered = [...comments];

    // Filter by type
    if (filterBy === 'solutions') {
      filtered = filtered.filter(comment => comment.isSolution);
    } else if (filterBy === 'replies') {
      filtered = filtered.filter(comment => comment.parentId);
    } else if (filterBy === 'topLevel') {
      filtered = filtered.filter(comment => !comment.parentId);
    }

    // Sort comments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'author':
          return (a.author?.name || '').localeCompare(b.author?.name || '');
        case 'createdAt':
        default:
          return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredComments(filtered);
  }, [comments, sortBy, filterBy]);

  const handleCommentCreated = (newComment) => {
    setShowCreateForm(false);
    if (onRefresh) onRefresh();
    toast.success('Comment added successfully!');
  };

  const handleLike = (commentId, isLiked) => {
    if (onLike) onLike(commentId, isLiked);
  };

  const handleMarkSolution = (commentId, isSolution) => {
    if (onMarkSolution) onMarkSolution(commentId, isSolution);
  };

  const handleReply = (comment) => {
    if (onReply) onReply(comment);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" text="Loading comments..." />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaComment className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">
            Comments ({filteredComments.length})
          </h3>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
        >
          Add Comment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="createdAt">Oldest First</option>
            <option value="likes">Most Liked</option>
            <option value="author">Author</option>
          </select>
          <FaSort className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Comments</option>
            <option value="solutions">Solutions Only</option>
            <option value="topLevel">Top Level</option>
            <option value="replies">Replies Only</option>
          </select>
          <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Create Comment Form */}
      {showCreateForm && (
        <CreateCommentForm
          parentId={parentId}
          onCommentCreated={handleCommentCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Comments */}
      {filteredComments.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FaComment className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to share your thoughts!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Add First Comment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={handleLike}
              onMarkSolution={handleMarkSolution}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;

