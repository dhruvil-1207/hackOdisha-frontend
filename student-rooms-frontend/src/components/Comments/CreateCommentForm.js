import React, { useState } from 'react';
import { FaSpinner, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { commentsService } from '../../services/comments';
import toast from 'react-hot-toast';

const CreateCommentForm = ({ 
  parentId, 
  onCommentCreated, 
  onCancel,
  placeholder = "Write your comment...",
  className = ''
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setContent(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!content.trim()) {
      setError('Comment content is required');
      return false;
    }
    if (content.length < 3) {
      setError('Comment must be at least 3 characters');
      return false;
    }
    if (content.length > 2000) {
      setError('Comment must be less than 2000 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const commentData = {
        content: content.trim(),
        parentId: parentId || null,
      };

      const newComment = await commentsService.createComment(commentData);
      
      toast.success('Comment added successfully!');
      onCommentCreated(newComment);
      
      // Reset form
      setContent('');
      setError('');
      
    } catch (error) {
      setError(error.message || 'Failed to create comment');
      toast.error(error.message || 'Failed to create comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setContent('');
      setError('');
      onCancel();
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            {content.length}/2000 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <FaTimes className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Posting...
              </>
            ) : (
              <>
                <FaPaperPlane className="h-4 w-4 mr-2" />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommentForm;
