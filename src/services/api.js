import axios from "axios";
import Constants from "expo-constants";

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

export const API_BASE_URL = deriveBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds - increased to handle multiple Google Maps API calls
});

export default api;
