import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const WebSocketContext = createContext();

const initialState = {
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  onlineUsers: [],
  typingUsers: {},
  notifications: [],
  currentRoom: null,
};

const wsReducer = (state, action) => {
  switch (action.type) {
    case 'WS_CONNECTING':
      return {
        ...state,
        isConnecting: true,
        error: null,
      };
    case 'WS_CONNECTED':
      return {
        ...state,
        socket: action.payload,
        isConnected: true,
        isConnecting: false,
        error: null,
      };
    case 'WS_DISCONNECTED':
      return {
        ...state,
        socket: null,
        isConnected: false,
        isConnecting: false,
        onlineUsers: [],
        typingUsers: {},
      };
    case 'WS_ERROR':
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      };
    case 'SET_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: action.payload,
      };
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'SET_CURRENT_ROOM':
      return {
        ...state,
        currentRoom: action.payload,
      };
    default:
      return state;
  }
};

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wsReducer, initialState);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = (token) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      return;
    }

    dispatch({ type: 'WS_CONNECTING' });

    try {
      const wsUrl = `ws://localhost:8001/ws?token=${token}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        dispatch({ type: 'WS_CONNECTED', payload: socket });
        reconnectAttempts.current = 0;
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        dispatch({ type: 'WS_DISCONNECTED' });
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect(token);
          }, 2000 * reconnectAttempts.current);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        dispatch({ type: 'WS_ERROR', payload: 'Connection failed' });
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    } catch (error) {
      dispatch({ type: 'WS_ERROR', payload: 'Failed to connect' });
    }
  };

  const handleMessage = (data) => {
    switch (data.type) {
      case 'online_users':
        dispatch({ type: 'SET_ONLINE_USERS', payload: data.users });
        break;
      case 'user_typing':
        dispatch({
          type: 'SET_TYPING_USERS',
          payload: { ...state.typingUsers, [data.userId]: data.isTyping },
        });
        break;
      case 'new_post':
        toast.success(`New post in ${data.roomName}: ${data.title}`);
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'new_post',
            message: `New post: ${data.title}`,
            roomId: data.roomId,
            timestamp: new Date(),
          },
        });
        break;
      case 'new_comment':
        toast.success(`New comment on post: ${data.postTitle}`);
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'new_comment',
            message: `New comment on: ${data.postTitle}`,
            postId: data.postId,
            timestamp: new Date(),
          },
        });
        break;
      case 'new_doubt':
        toast.success(`New doubt in ${data.roomName}: ${data.title}`);
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'new_doubt',
            message: `New doubt: ${data.title}`,
            roomId: data.roomId,
            timestamp: new Date(),
          },
        });
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (state.socket) {
      state.socket.close();
    }
    dispatch({ type: 'WS_DISCONNECTED' });
  };

  const joinRoom = (roomId) => {
    if (state.socket && state.isConnected) {
      state.socket.send(JSON.stringify({
        type: 'join_room',
        roomId,
      }));
      dispatch({ type: 'SET_CURRENT_ROOM', payload: roomId });
    }
  };

  const leaveRoom = (roomId) => {
    if (state.socket && state.isConnected) {
      state.socket.send(JSON.stringify({
        type: 'leave_room',
        roomId,
      }));
      dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
    }
  };

  const sendTyping = (roomId, isTyping) => {
    if (state.socket && state.isConnected) {
      state.socket.send(JSON.stringify({
        type: 'typing',
        roomId,
        isTyping,
      }));
    }
  };

  const removeNotification = (notificationId) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (state.socket) {
        state.socket.close();
      }
    };
  }, []);

  const value = {
    ...state,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendTyping,
    removeNotification,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

