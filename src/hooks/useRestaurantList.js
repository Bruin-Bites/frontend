import { useState, useEffect } from "react";
import api from "../services/api";

const FALLBACK_RESTAURANTS = [
  {
    id: "mock-financial-workshop",
    name: "Financial Literacy Workshop",
    address: "1000 Glendon Ave, Los Angeles, CA 90024",
    geometry: {
      location: {
        lat: 34.059335,
        lng: -118.442651,
      },
    },
    rating: 4.9,
    priceLevel: 1,
    types: ["on_campus", "financial_service", "community_center"],
  },
  {
    id: "mock-bruins-bite",
    name: "Bruin Bites Pop-Up",
    address: "308 Westwood Plaza, Los Angeles, CA 90095",
    geometry: {
      location: {
        lat: 34.070555,
        lng: -118.444987,
      },
    },
    rating: 4.7,
    priceLevel: 1,
    types: ["cafe", "student_center", "meal_delivery"],
  },
  {
    id: "mock-campus-cafe",
    name: "Campus Commons Café",
    address: "330 De Neve Dr, Los Angeles, CA 90095",
    geometry: {
      location: {
        lat: 34.072331,
        lng: -118.450212,
      },
    },
    rating: 4.5,
    priceLevel: 2,
    types: ["cafe", "restaurant", "breakfast"],
  },
];

export default function useRestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        const data = Array.isArray(res.data) ? res.data : [];
        setRestaurants(data);
        setError(null);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          err.toString?.() ||
          "Unable to load restaurants.";
        console.error("Error fetching restaurants:", message);
        setRestaurants(FALLBACK_RESTAURANTS);
        setError(
          "We couldn't reach the server—showing sample data for now."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}
