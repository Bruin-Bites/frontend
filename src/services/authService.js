import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = '@bruin_bites_token';
const USER_KEY = '@bruin_bites_user';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Register a new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} isUCLAStudent - Whether user is a UCLA student
 * @returns {Promise<{token: string, user: object}>}
 */
export const register = async (name, email, password, isUCLAStudent = false) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      isUCLAStudent,
    });

    const { token, user } = response.data;

    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

/**
 * Logout user and clear stored token
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

/**
 * Get stored authentication token
 * @returns {Promise<string|null>}
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Get stored user data
 * @returns {Promise<object|null>}
 */
export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

/**
 * Clear all stored auth data
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

