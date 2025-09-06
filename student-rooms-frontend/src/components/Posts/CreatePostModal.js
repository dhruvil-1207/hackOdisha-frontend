import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaImage, FaFile, FaTag } from 'react-icons/fa';
import { postsService } from '../../services/posts';
import { filesService } from '../../services/files';
import FileUpload from '../UI/FileUpload';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose, onPostCreated, roomId }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note',
    tags: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (uploadedFiles) => {
    setAttachments(prev => [...prev, ...uploadedFiles]);
  };

  const handleFileRemove = (fileToRemove) => {
    setAttachments(prev => prev.filter(file => file.id !== fileToRemove.id));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        attachments: attachments.map(file => ({
          name: file.name,
          url: file.url,
          type: file.type,
          size: file.size
        })),
      };

      const newPost = await postsService.createPost(roomId, postData);
      
      toast.success('Post created successfully!');
      onPostCreated(newPost);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'note',
        tags: '',
      });
      setAttachments([]);
      setErrors({});
      
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        content: '',
        type: 'note',
        tags: '',
      });
      setAttachments([]);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Post</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'note', label: 'Note', icon: '📝', description: 'Study notes and resources' },
                { value: 'topic', label: 'Topic', icon: '💬', description: 'Discussion topic' },
                { value: 'announcement', label: 'Announcement', icon: '📢', description: 'Important updates' },
              ].map(({ value, label, icon, description }) => (
                <label key={value} className="relative">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={formData.type === value}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.type === value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">{icon}</div>
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500 mt-1">{description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..."
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.content.length}/5000 characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="study, math, physics (comma separated)"
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <FileUpload
              onUpload={handleFileUpload}
              onRemove={handleFileRemove}
              multiple={true}
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
