import axios from "axios";
import Constants from "expo-constants";

const BASE_URL =
  (Constants?.expoConfig?.extra && Constants.expoConfig.extra.API_URL) ||
  "http://localhost:5050/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
});

export default api;
