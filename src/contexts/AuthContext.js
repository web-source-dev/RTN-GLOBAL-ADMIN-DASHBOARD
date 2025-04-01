import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../BackendAPi/ApiProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = async () => {
      try {
        const response = await API.get('/api/auth/me');
        setUser(response.data);
      } catch (err) {
        // User is not authenticated - that's okay
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/api/auth/login', {
        email,
        password
      });
      
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await API.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if logout API fails
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await API.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    refreshUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
