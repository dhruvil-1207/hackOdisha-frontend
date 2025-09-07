import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

// Simplified authentication - always authenticated
const initialState = {
  user: {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@student.com',
    avatar: null,
    university: 'Demo University',
    major: 'Computer Science',
    bio: 'Welcome to Student Rooms!',
  },
  token: 'demo-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      console.log('AuthReducer: AUTH_SUCCESS - setting authenticated to true');
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simplified - always start as authenticated
  useEffect(() => {
    // Just set loading to false after a brief moment
    setTimeout(() => {
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: initialState.user, token: initialState.token } });
    }, 100);
  }, []);

  const login = useCallback(async (email, password) => {
    // Fake loading for verification effect
    dispatch({ type: 'AUTH_START' });
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Always succeed with demo user
    const demoUser = {
      id: 'demo-user',
      name: email.split('@')[0] || 'Student',
      email: email,
      avatar: null,
      university: 'Demo University',
      major: 'Computer Science',
      bio: 'Welcome to Student Rooms!',
    };
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: demoUser, token: 'demo-token' },
    });
    
    return { success: true };
  }, []);

  const register = useCallback(async (name, email, password) => {
    // Fake loading for verification effect
    dispatch({ type: 'AUTH_START' });
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Always succeed with new user
    const newUser = {
      id: 'demo-user-' + Date.now(),
      name: name,
      email: email,
      avatar: null,
      university: 'Demo University',
      major: 'Computer Science',
      bio: 'New Student at Student Rooms!',
    };
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: newUser, token: 'demo-token' },
    });
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
