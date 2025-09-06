import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ErrorBoundary from './components/UI/ErrorBoundary';
import NotificationToast from './components/Realtime/NotificationToast';

import Navbar from './components/navbar';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import RoomDetails from './pages/roomDetails';
import Reports from './pages/reports';
import Profile from './pages/profile';
import Home from './pages/home';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WebSocketProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms/:roomId" element={<RoomDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Global Components */}
            <NotificationToast />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </WebSocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
