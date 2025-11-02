import { useState, useEffect } from "react";
import api from "../services/api";

export default function useRestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        const message =
          err.response?.data?.error || err.response?.data?.message;
        console.error(
          "Error fetching restaurants:",
          message || err.message || err.toString()
        );
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return { restaurants, loading };
}
