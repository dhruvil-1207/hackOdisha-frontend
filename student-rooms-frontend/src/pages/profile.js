import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaCalendar, FaGraduationCap, FaTrophy, FaComments, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    university: '',
    major: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        university: user.university || '',
        major: user.major || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      university: user.university || '',
      major: user.major || '',
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be logged in to access your profile.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="h-10 w-10 text-indigo-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    user.name
                  )}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    user.email
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <FaSave className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <FaTimes className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FaEdit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600">
                      {user.bio || 'No bio available'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your university"
                      />
                    ) : (
                      <p className="text-gray-600">
                        {user.university || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Major
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your major"
                      />
                    ) : (
                      <p className="text-gray-600">
                        {user.major || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaComments className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-600">Posts Created</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.postsCount || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaQuestionCircle className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-600">Questions Asked</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.questionsCount || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaTrophy className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-600">Solutions Provided</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.solutionsCount || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
