import React, { useState } from 'react';
import { FaTimes, FaKey, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { roomsService } from '../../services/rooms';
import toast from 'react-hot-toast';

const JoinRoomModal = ({ isOpen, onClose, onRoomJoined }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setInviteCode(e.target.value);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await roomsService.joinRoom(inviteCode.trim());
      
      setSuccess(true);
      toast.success('Successfully joined room!');
      
      // Reset form after a short delay
      setTimeout(() => {
        setInviteCode('');
        setSuccess(false);
        onRoomJoined(result);
        onClose();
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Failed to join room');
      toast.error(error.message || 'Failed to join room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setInviteCode('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Join Room</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
              <FaKey className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-600">
              Enter the invite code provided by the room creator to join a private room.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                Invite Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? 'border-red-300' : success ? 'border-green-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter invite code"
                  disabled={isSubmitting || success}
                  autoComplete="off"
                />
                {success && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <FaExclamationCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <FaCheckCircle className="h-4 w-4 mr-1" />
                  Successfully joined the room!
                </div>
              )}
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
                disabled={isSubmitting || success || !inviteCode.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Joining...
                  </>
                ) : success ? (
                  <>
                    <FaCheckCircle className="h-4 w-4 mr-2" />
                    Joined!
                  </>
                ) : (
                  'Join Room'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-1">How to get an invite code?</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Ask the room creator for the invite code</li>
            <li>• Check if the room creator shared it in a public space</li>
            <li>• Look for the code in the room's description or details</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;

