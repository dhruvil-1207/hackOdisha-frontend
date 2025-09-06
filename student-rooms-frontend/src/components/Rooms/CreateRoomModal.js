import React, { useState } from 'react';
import { FaTimes, FaLock, FaGlobe, FaTag, FaSpinner } from 'react-icons/fa';
import { roomsService } from '../../services/rooms';
import toast from 'react-hot-toast';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Room name must be less than 50 characters';
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
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
      const roomData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const newRoom = await roomsService.createRoom(roomData);
      
      toast.success('Room created successfully!');
      onRoomCreated(newRoom);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        tags: '',
      });
      setErrors({});
      
    } catch (error) {
      toast.error(error.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        tags: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Room</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter room name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this room is for..."
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPrivate"
                  value={false}
                  checked={!formData.isPrivate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <FaGlobe className="h-4 w-4 text-green-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Public</div>
                    <div className="text-xs text-gray-500">Anyone can find and join</div>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isPrivate"
                  value={true}
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <FaLock className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Private</div>
                    <div className="text-xs text-gray-500">Only invited members can join</div>
                  </div>
                </div>
              </label>
            </div>
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
                placeholder="math, physics, study (comma separated)"
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
