import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaPlus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import DoubtCard from './DoubtCard';
import CreateDoubtModal from './CreateDoubtModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import { doubtsService } from '../../services/doubts';
import toast from 'react-hot-toast';

const DoubtList = ({ 
  roomId, 
  doubts = [], 
  loading = false, 
  onRefresh,
  showActions = false,
  onEdit,
  onDelete,
  onLike,
  onMarkUrgent,
  onClose,
  onReopen,
  onComment,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filteredDoubts, setFilteredDoubts] = useState([]);

  // Filter and sort doubts
  useEffect(() => {
    let filtered = [...doubts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doubt =>
        doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (filterBy === 'open') {
      filtered = filtered.filter(doubt => !doubt.isClosed);
    } else if (filterBy === 'closed') {
      filtered = filtered.filter(doubt => doubt.isClosed);
    } else if (filterBy === 'urgent') {
      filtered = filtered.filter(doubt => doubt.isUrgent);
    } else if (filterBy === 'myDoubts') {
      filtered = filtered.filter(doubt => doubt.isOwner);
    }

    // Sort doubts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return (a.author?.name || '').localeCompare(b.author?.name || '');
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'comments':
          return (b.comments || 0) - (a.comments || 0);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredDoubts(filtered);
  }, [doubts, searchQuery, sortBy, filterBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // If search query is long enough, search on server
    if (query.length >= 3 && roomId) {
      try {
        const results = await doubtsService.searchDoubts(roomId, query);
        // You might want to merge server results with local results
        // This depends on your backend implementation
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const handleCreateDoubt = () => {
    setShowCreateModal(true);
  };

  const handleDoubtCreated = (newDoubt) => {
    setShowCreateModal(false);
    if (onRefresh) onRefresh();
    toast.success('Doubt posted successfully!');
  };

  const handleLike = (doubtId, isLiked) => {
    if (onLike) onLike(doubtId, isLiked);
  };

  const handleMarkUrgent = (doubtId, isUrgent) => {
    if (onMarkUrgent) onMarkUrgent(doubtId, isUrgent);
  };

  const handleClose = (doubtId) => {
    if (onClose) onClose(doubtId);
  };

  const handleReopen = (doubtId) => {
    if (onReopen) onReopen(doubtId);
  };

  const handleComment = (doubt) => {
    if (onComment) onComment(doubt);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading doubts..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questions & Doubts</h2>
          <p className="text-gray-600">
            {filteredDoubts.length} question{filteredDoubts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <button
          onClick={handleCreateDoubt}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Ask Question
        </button>
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
            placeholder="Search questions..."
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
            <option value="createdAt">Newest First</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="likes">Most Liked</option>
            <option value="comments">Most Commented</option>
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
            <option value="all">All Questions</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="urgent">Urgent</option>
            <option value="myDoubts">My Questions</option>
          </select>
          <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Doubts */}
      {filteredDoubts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FaQuestionCircle className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No questions found' : 'No questions yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or filters'
              : 'Be the first to ask a question in this room!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreateDoubt}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Ask Your First Question
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <DoubtCard
              key={doubt.id}
              doubt={doubt}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={handleLike}
              onMarkUrgent={handleMarkUrgent}
              onClose={handleClose}
              onReopen={handleReopen}
              onComment={handleComment}
            />
          ))}
        </div>
      )}

      {/* Create Doubt Modal */}
      <CreateDoubtModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onDoubtCreated={handleDoubtCreated}
        roomId={roomId}
      />
    </div>
  );
};

export default DoubtList;

