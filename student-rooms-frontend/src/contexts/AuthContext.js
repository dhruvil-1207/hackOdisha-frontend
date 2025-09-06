import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
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

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        } catch (error) {
          localStorage.removeItem('authToken');
          dispatch({
            type: 'AUTH_FAILURE',
            payload: 'Session expired. Please login again.',
          });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('authToken', response.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Login failed',
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.register(name, email, password);
      localStorage.setItem('authToken', response.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Registration failed',
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

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
