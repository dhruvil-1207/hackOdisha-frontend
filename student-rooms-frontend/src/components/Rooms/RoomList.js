import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaFilter, FaSort } from 'react-icons/fa';
import RoomCard from './RoomCard';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import { roomsService } from '../../services/rooms';
import toast from 'react-hot-toast';

const RoomList = ({ 
  rooms = [], 
  loading = false, 
  onRefresh,
  showActions = false,
  onJoin,
  onLeave,
  onDelete,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Filter and sort rooms
  useEffect(() => {
    let filtered = [...rooms];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (filterBy === 'joined') {
      filtered = filtered.filter(room => room.isJoined);
    } else if (filterBy === 'owned') {
      filtered = filtered.filter(room => room.isOwner);
    } else if (filterBy === 'public') {
      filtered = filtered.filter(room => !room.isPrivate);
    } else if (filterBy === 'private') {
      filtered = filtered.filter(room => room.isPrivate);
    }

    // Sort rooms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'memberCount':
          return (b.memberCount || 0) - (a.memberCount || 0);
        case 'postCount':
          return (b.postCount || 0) - (a.postCount || 0);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lastActivity':
        default:
          return new Date(b.lastActivity || b.createdAt) - new Date(a.lastActivity || a.createdAt);
      }
    });

    setFilteredRooms(filtered);
  }, [rooms, searchQuery, sortBy, filterBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // If search query is long enough, search on server
    if (query.length >= 3) {
      try {
        const results = await roomsService.searchRooms(query);
        // You might want to merge server results with local results
        // This depends on your backend implementation
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleJoinRoom = () => {
    setShowJoinModal(true);
  };

  const handleRoomCreated = (newRoom) => {
    setShowCreateModal(false);
    if (onRefresh) onRefresh();
    toast.success('Room created successfully!');
  };

  const handleRoomJoined = () => {
    setShowJoinModal(false);
    if (onRefresh) onRefresh();
    toast.success('Successfully joined room!');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading rooms..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Rooms</h2>
          <p className="text-gray-600">
            {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Create Room
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="lastActivity">Last Activity</option>
            <option value="name">Name</option>
            <option value="memberCount">Members</option>
            <option value="postCount">Posts</option>
            <option value="createdAt">Created Date</option>
          </select>
          <FaSort className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Rooms</option>
            <option value="joined">Joined</option>
            <option value="owned">Owned by Me</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FaSearch className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No rooms found' : 'No rooms available'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or filters'
              : 'Be the first to create a study room!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreateRoom}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Create Your First Room
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              showActions={showActions}
              onJoin={onJoin}
              onLeave={onLeave}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={handleRoomCreated}
      />
      
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onRoomJoined={handleRoomJoined}
      />
    </div>
  );
};

export default RoomList;

