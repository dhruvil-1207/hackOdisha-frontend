import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaComments, FaQuestionCircle, FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import PostList from '../components/Posts/PostList';
import DoubtList from '../components/Doubts/DoubtList';
import CommentList from '../components/Comments/CommentList';
import OnlineUsers from '../components/Realtime/OnlineUsers';
import TypingIndicator from '../components/Realtime/TypingIndicator';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { roomsService, postsService, doubtsService, commentsService } from '../services';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { joinRoom, leaveRoom, onlineUsers, typingUsers, sendTyping } = useWebSocket();
  
  const [room, setRoom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');

  // TEMPORARY: Mock room data for review
  useEffect(() => {
    const mockRoomData = {
      id: roomId,
      name: 'Advanced React Development',
      description: 'Learn advanced React concepts, hooks, and state management. This room covers everything from basic components to advanced patterns.',
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
    };

    const mockPosts = [
      {
        id: 'post-1',
        title: 'React Hooks Deep Dive',
        content: 'Let\'s explore the most commonly used React hooks and their advanced patterns...',
        type: 'note',
        author: {
          id: 'user-2',
          name: 'Alice Johnson',
          avatar: null
        },
        createdAt: '2024-01-20T14:30:00Z',
        likes: 12,
        isLiked: false,
        isPinned: true,
        attachments: []
      },
      {
        id: 'post-2',
        title: 'State Management with Context API',
        content: 'Here\'s a comprehensive guide to managing state using React Context API...',
        type: 'topic',
        author: {
          id: 'user-3',
          name: 'Bob Wilson',
          avatar: null
        },
        createdAt: '2024-01-19T09:15:00Z',
        likes: 8,
        isLiked: true,
        isPinned: false,
        attachments: []
      }
    ];

    const mockDoubts = [
      {
        id: 'doubt-1',
        title: 'How to optimize re-renders in React?',
        content: 'I\'m experiencing performance issues with my React app. What are the best practices to minimize re-renders?',
        author: {
          id: 'user-4',
          name: 'Charlie Brown',
          avatar: null
        },
        createdAt: '2024-01-21T16:45:00Z',
        likes: 5,
        isLiked: false,
        isUrgent: false,
        isSolved: false,
        tags: ['performance', 'optimization']
      }
    ];

    setRoom(mockRoomData);
    setPosts(mockPosts);
    setDoubts(mockDoubts);
    setLoading(false);
  }, [roomId]);

  // Join room via WebSocket
  useEffect(() => {
    if (isAuthenticated && roomId) {
      joinRoom(roomId);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [isAuthenticated, roomId, joinRoom, leaveRoom]);

  const handleRefresh = async () => {
    try {
      const [postsData, doubtsData] = await Promise.all([
        postsService.getPosts(roomId),
        doubtsService.getDoubts(roomId)
      ]);
      
      setPosts(postsData);
      setDoubts(doubtsData);
    } catch (error) {
      toast.error(error.message || 'Failed to refresh data');
    }
  };

  const handlePostLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await postsService.likePost(postId);
      } else {
        await postsService.unlikePost(postId);
      }
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked, likes: post.likes + (isLiked ? 1 : -1) }
          : post
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleDoubtLike = async (doubtId, isLiked) => {
    try {
      if (isLiked) {
        await doubtsService.likeDoubt(doubtId);
      } else {
        await doubtsService.unlikeDoubt(doubtId);
      }
      
      setDoubts(prev => prev.map(doubt => 
        doubt.id === doubtId 
          ? { ...doubt, isLiked, likes: doubt.likes + (isLiked ? 1 : -1) }
          : doubt
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleCommentLike = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await commentsService.likeComment(commentId);
      } else {
        await commentsService.unlikeComment(commentId);
      }
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked, likes: comment.likes + (isLiked ? 1 : -1) }
          : comment
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handlePostComment = (post) => {
    // This would open a comment modal or navigate to a comment section
    console.log('Comment on post:', post);
  };

  const handleDoubtComment = (doubt) => {
    // This would open a comment modal or navigate to a comment section
    console.log('Comment on doubt:', doubt);
  };

  // TEMPORARY: Comment out auth check for review
  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access this room</h2>
  //         <p className="text-gray-600">You need to be logged in to view room details.</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading room..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <p className="text-gray-600">The room you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-gray-600">{room.description}</p>
            </div>
          </div>

          {/* Room Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FaUsers className="h-4 w-4" />
              <span>{room.memberCount || 0} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComments className="h-4 w-4" />
              <span>{posts.length} posts</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaQuestionCircle className="h-4 w-4" />
              <span>{doubts.length} questions</span>
            </div>
          </div>

          {/* Online Users */}
          <div className="mt-4">
            <OnlineUsers users={onlineUsers} maxDisplay={8} />
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts and questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'posts', label: 'Posts & Notes', icon: FaComments, count: posts.length },
                { id: 'doubts', label: 'Questions', icon: FaQuestionCircle, count: doubts.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'posts' && (
            <PostList
              roomId={roomId}
              posts={posts}
              loading={loading}
              onRefresh={handleRefresh}
              showActions={true}
              onLike={handlePostLike}
              onComment={handlePostComment}
            />
          )}

          {activeTab === 'doubts' && (
            <DoubtList
              roomId={roomId}
              doubts={doubts}
              loading={loading}
              onRefresh={handleRefresh}
              showActions={true}
              onLike={handleDoubtLike}
              onComment={handleDoubtComment}
            />
          )}
        </div>

        {/* Typing Indicator */}
        <div className="fixed bottom-4 right-4">
          <TypingIndicator users={Object.values(typingUsers).filter(user => user.isTyping)} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
