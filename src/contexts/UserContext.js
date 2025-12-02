import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/user/profile");
        setUser(response.data);
      } else {
        // Set a default mock user for development when not logged in
        setUser({
          username: "My_super_username",
          email: "user_name@ucla.edu",
          school: "University of California, Los Angeles",
          graduatingYear: "2029",
          phone: "+1 (123) 456-789",
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      // Set a default mock user on error for development
      setUser({
        username: "My_super_username",
        email: "user_name@ucla.edu",
        school: "University of California, Los Angeles",
        graduatingYear: "2029",
        phone: "+1 (123) 456-789",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await api.put("/user/profile", userData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout, refreshUser: loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

