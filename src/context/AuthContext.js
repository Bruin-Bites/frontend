import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, getUser, logout as authLogout, login as authLogin, register as authRegister } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { token: newToken, user: newUser } = await authLogin(email, password);
      setToken(newToken);
      setUser(newUser);
      return { token: newToken, user: newUser };
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, isUCLAStudent = false) => {
    try {
      const { token: newToken, user: newUser } = await authRegister(name, email, password, isUCLAStudent);
      setToken(newToken);
      setUser(newUser);
      return { token: newToken, user: newUser };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    checkAuth,
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

