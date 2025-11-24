import { useState, useEffect } from "react";
import api from "../services/api";

// Module-level cache to persist data across component unmounts/remounts
let cachedRestaurants = null;
let cachedLoading = true;
let cachedError = null;
let fetchPromise = null;

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
  // Initialize state from cache if available
  const [restaurants, setRestaurants] = useState(cachedRestaurants || []);
  const [loading, setLoading] = useState(cachedLoading);
  const [error, setError] = useState(cachedError);

  useEffect(() => {
    console.log("[useRestaurantList] useEffect triggered");

    // If we already have cached data, use it and don't fetch again
    if (cachedRestaurants !== null) {
      console.log("[useRestaurantList] Using cached data:", {
        count: cachedRestaurants.length,
        loading: cachedLoading,
        hasError: cachedError !== null,
      });
      setRestaurants(cachedRestaurants);
      setLoading(false);
      setError(cachedError);
      console.log("[useRestaurantList] State updated from cache");
      return;
    }

    // If a fetch is already in progress, wait for it
    if (fetchPromise) {
      console.log("[useRestaurantList] Fetch already in progress, waiting...");
      fetchPromise
        .then(() => {
          console.log("[useRestaurantList] In-progress fetch completed, updating state:", {
            count: cachedRestaurants?.length || 0,
            loading: cachedLoading,
            hasError: cachedError !== null,
          });
          setRestaurants(cachedRestaurants);
          setLoading(cachedLoading);
          setError(cachedError);
        })
        .catch(() => {
          console.log("[useRestaurantList] In-progress fetch failed, updating state with fallback");
          setRestaurants(cachedRestaurants);
          setLoading(cachedLoading);
          setError(cachedError);
        });
      return;
    }

    // Start a new fetch
    console.log("[useRestaurantList] Starting new fetch...");
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        const data = Array.isArray(res.data) ? res.data : [];
        console.log("[useRestaurantList] API call successful:", {
          dataLength: data.length,
          firstItem: data[0]?.name || "N/A",
        });
        
        // Update cache
        cachedRestaurants = data;
        cachedLoading = false;
        cachedError = null;
        console.log("[useRestaurantList] Cache updated:", {
          count: cachedRestaurants.length,
          loading: cachedLoading,
          hasError: cachedError !== null,
        });
        
        // Update state
        setRestaurants(data);
        setError(null);
        console.log("[useRestaurantList] State updated with fetched data");
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          err.toString?.() ||
          "Unable to load restaurants.";
        console.error("[useRestaurantList] API call failed:", {
          message,
          status: err.response?.status,
          data: err.response?.data,
        });
        
        // Update cache with fallback
        cachedRestaurants = FALLBACK_RESTAURANTS;
        cachedLoading = false;
        cachedError = "We couldn't reach the server—showing sample data for now.";
        console.log("[useRestaurantList] Cache updated with fallback data:", {
          count: cachedRestaurants.length,
          loading: cachedLoading,
          error: cachedError,
        });
        
        // Update state
        setRestaurants(FALLBACK_RESTAURANTS);
        setError(cachedError);
        console.log("[useRestaurantList] State updated with fallback data");
      } finally {
        setLoading(false);
        fetchPromise = null; // Clear the promise
        console.log("[useRestaurantList] Fetch completed, promise cleared");
      }
    };
    
    fetchPromise = fetchRestaurants();
  }, []); // Empty deps - only run on mount


  return { restaurants, loading, error };
}
