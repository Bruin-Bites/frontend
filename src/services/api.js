import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@bruin_bites_token';

const deriveBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  const extraUrl = Constants?.expoConfig?.extra?.API_URL;
  if (extraUrl) return extraUrl;

  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) return `http://${host}:5050/api`;
  }

  const debuggerHost = Constants?.manifest?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    if (host) return `http://${host}:5050/api`;
  }

  return "http://localhost:5050/api";
};

const BASE_URL = deriveBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 120 seconds for AI recipe generation with pricing
});

// Request interceptor to attach token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored token
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem('@bruin_bites_user');
      } catch (storageError) {
        console.error('Error clearing token on 401:', storageError);
      }
      
      // You can add navigation logic here if needed
      // For now, we'll just reject the promise
    }
    return Promise.reject(error);
  }
);

export default api;
