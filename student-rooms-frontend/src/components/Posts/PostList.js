import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaSort, FaThumbtack } from 'react-icons/fa';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import { postsService } from '../../services/posts';
import toast from 'react-hot-toast';

const PostList = ({ 
  roomId, 
  posts = [], 
  loading = false, 
  onRefresh,
  showActions = false,
  onEdit,
  onDelete,
  onLike,
  onComment,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [regularPosts, setRegularPosts] = useState([]);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterBy !== 'all') {
      filtered = filtered.filter(post => post.type === filterBy);
    }

    // Sort posts
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

    // Separate pinned and regular posts
    const pinned = filtered.filter(post => post.isPinned);
    const regular = filtered.filter(post => !post.isPinned);

    setPinnedPosts(pinned);
    setRegularPosts(regular);
    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy, filterBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // If search query is long enough, search on server
    if (query.length >= 3 && roomId) {
      try {
        const results = await postsService.searchPosts(roomId, query);
        // You might want to merge server results with local results
        // This depends on your backend implementation
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handlePostCreated = (newPost) => {
    setShowCreateModal(false);
    if (onRefresh) onRefresh();
    toast.success('Post created successfully!');
  };

  const handleLike = (postId, isLiked) => {
    if (onLike) onLike(postId, isLiked);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading posts..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Posts & Notes</h2>
          <p className="text-gray-600">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Create Post
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
            placeholder="Search posts..."
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
            <option value="all">All Types</option>
            <option value="note">Notes</option>
            <option value="topic">Topics</option>
            <option value="announcement">Announcements</option>
          </select>
          <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FaSearch className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No posts found' : 'No posts available'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or filters'
              : 'Be the first to create a post in this room!'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Create Your First Post
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaThumbtack className="h-4 w-4 text-yellow-500" />
                <h3 className="text-lg font-medium text-gray-900">Pinned Posts</h3>
              </div>
              <div className="space-y-4">
                {pinnedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLike={handleLike}
                    onComment={onComment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              {pinnedPosts.length > 0 && (
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Posts</h3>
              )}
              <div className="space-y-4">
                {regularPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLike={handleLike}
                    onComment={onComment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
        roomId={roomId}
      />
    </div>
  );
};

export default PostList;
