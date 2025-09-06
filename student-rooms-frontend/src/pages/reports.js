import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaComments, FaQuestionCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Simulate loading reports
    const loadReports = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReports([
          {
            id: 1,
            type: 'inappropriate_content',
            title: 'Inappropriate Content Report',
            description: 'User reported inappropriate content in a post',
            status: 'pending',
            createdAt: new Date('2024-01-15'),
            roomName: 'Math Study Group',
          },
          {
            id: 2,
            type: 'spam',
            title: 'Spam Report',
            description: 'User reported spam messages in room chat',
            status: 'resolved',
            createdAt: new Date('2024-01-10'),
            roomName: 'Physics Study Room',
          },
          {
            id: 3,
            type: 'harassment',
            title: 'Harassment Report',
            description: 'User reported harassment from another member',
            status: 'investigating',
            createdAt: new Date('2024-01-12'),
            roomName: 'Computer Science',
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    if (isAuthenticated) {
      loadReports();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'inappropriate_content':
        return <FaExclamationTriangle className="h-5 w-5 text-red-500" />;
      case 'spam':
        return <FaComments className="h-5 w-5 text-orange-500" />;
      case 'harassment':
        return <FaUsers className="h-5 w-5 text-red-600" />;
      default:
        return <FaChartBar className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view reports</h2>
          <p className="text-gray-600">You need to be logged in to access the reports section.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Moderation</h1>
          <p className="text-gray-600">Manage and review user reports and moderation actions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaChartBar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Investigating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.filter(r => r.status === 'investigating').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FaChartBar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">There are no reports to review at this time.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(report.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {report.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>Room: {report.roomName}</span>
                          <span>•</span>
                          <span>{report.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors">
                        View Details
                      </button>
                      {report.status === 'pending' && (
                        <button className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors">
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
