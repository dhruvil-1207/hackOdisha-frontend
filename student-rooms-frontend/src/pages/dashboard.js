import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import RoomList from '../components/Rooms/RoomList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { roomsService } from '../services/rooms';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { connect, isConnected } = useWebSocket();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      connect(user.token);
    }
  }, [isAuthenticated, user?.token, connect]);

  // TEMPORARY: Mock rooms for review
  useEffect(() => {
    const mockRooms = [
      {
        id: 'room-1',
        name: 'Advanced React Development',
        description: 'Learn advanced React concepts, hooks, and state management',
        subject: 'Computer Science',
        university: 'Demo University',
        memberCount: 25,
        maxMembers: 50,
        isPrivate: false,
        inviteCode: 'REACT2024',
        createdAt: '2024-01-15T10:00:00Z',
        createdBy: {
          id: 'user-1',
          name: 'Dr. Smith',
          avatar: null
        }
      },
      {
        id: 'room-2',
        name: 'Data Structures & Algorithms',
        description: 'Master fundamental data structures and algorithmic thinking',
        subject: 'Computer Science',
        university: 'Demo University',
        memberCount: 42,
        maxMembers: 60,
        isPrivate: false,
        inviteCode: 'DSA2024',
        createdAt: '2024-01-10T14:30:00Z',
        createdBy: {
          id: 'user-2',
          name: 'Prof. Johnson',
          avatar: null
        }
      },
      {
        id: 'room-3',
        name: 'Machine Learning Study Group',
        description: 'Explore ML algorithms, neural networks, and AI applications',
        subject: 'Artificial Intelligence',
        university: 'Demo University',
        memberCount: 18,
        maxMembers: 30,
        isPrivate: true,
        inviteCode: 'ML2024',
        createdAt: '2024-01-20T09:15:00Z',
        createdBy: {
          id: 'user-3',
          name: 'Dr. Chen',
          avatar: null
        }
      }
    ];
    
    setRooms(mockRooms);
    setLoading(false);
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const roomsData = await roomsService.getRooms();
      setRooms(roomsData);
    } catch (error) {
      toast.error(error.message || 'Failed to refresh rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room) => {
    try {
      await roomsService.joinRoom(room.inviteCode);
      toast.success(`Joined ${room.name} successfully!`);
      handleRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to join room');
    }
  };

  const handleLeaveRoom = async (room) => {
    try {
      await roomsService.leaveRoom(room.id);
      toast.success(`Left ${room.name}`);
      handleRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to leave room');
    }
  };

  const handleDeleteRoom = async (room) => {
    if (window.confirm(`Are you sure you want to delete "${room.name}"? This action cannot be undone.`)) {
      try {
        await roomsService.deleteRoom(room.id);
        toast.success(`Deleted ${room.name}`);
        handleRefresh();
      } catch (error) {
        toast.error(error.message || 'Failed to delete room');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h2>
          <p className="text-gray-600">You need to be logged in to view your study rooms.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading your rooms..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your learning journey in your study rooms
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Rooms */}
        <RoomList
          rooms={rooms}
          loading={loading}
          onRefresh={handleRefresh}
          showActions={true}
          onJoin={handleJoinRoom}
          onLeave={handleLeaveRoom}
          onDelete={handleDeleteRoom}
        />
      </div>
    </div>
  );
};

export default Dashboard;
