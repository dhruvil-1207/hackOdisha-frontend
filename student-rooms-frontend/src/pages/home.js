import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaComments, FaQuestionCircle, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: FaUsers,
      title: 'Study Rooms',
      description: 'Create and join study rooms with your classmates. Collaborate on projects and share resources.',
    },
    {
      icon: FaComments,
      title: 'Real-time Chat',
      description: 'Communicate instantly with your study group. Share notes, ask questions, and get help.',
    },
    {
      icon: FaQuestionCircle,
      title: 'Q&A System',
      description: 'Ask questions and get answers from your peers. Mark solutions and help others learn.',
    },
    {
      icon: FaRocket,
      title: 'File Sharing',
      description: 'Upload and share documents, images, and other study materials with your group.',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Active Students' },
    { number: '500+', label: 'Study Rooms' },
    { number: '10K+', label: 'Questions Asked' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Study Together, Learn Better
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Join thousands of students collaborating in virtual study rooms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to study effectively
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to enhance your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-indigo-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create an Account
              </h3>
              <p className="text-gray-600">
                Sign up with your email and start your learning journey
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Join or Create Rooms
              </h3>
              <p className="text-gray-600">
                Find study rooms or create your own for specific subjects
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Collaborating
              </h3>
              <p className="text-gray-600">
                Share notes, ask questions, and learn together with your peers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to start studying together?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students who are already learning better together
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaRocket className="h-5 w-5 mr-2" />
              Get Started Now
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-indigo-600 mb-4">
              <FaGraduationCap className="h-8 w-8" />
              <span>Student Rooms</span>
            </div>
            <p className="text-gray-600 mb-4">
              Empowering students to learn together, anywhere, anytime.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Student Rooms. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
