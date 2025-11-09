import { useMemo } from "react";
import {
  calculateDistanceMeters,
  formatDistanceText,
} from "../../../utils/geo";

const INFINITY_DISTANCE = Number.POSITIVE_INFINITY;

const hasCoordinate = (item) => {
  // Check for both formats: lat/lng (abbreviated) and latitude/longitude (full)
  const hasLat = item?.geometry?.location?.lat !== undefined || 
                 item?.geometry?.location?.latitude !== undefined;
  const hasLng = item?.geometry?.location?.lng !== undefined || 
                 item?.geometry?.location?.longitude !== undefined;
  
  return hasLat && hasLng;
};

const buildDestination = (item) => {
  if (!hasCoordinate(item)) {
    return null;
  }
  // Support both formats: lat/lng (abbreviated) and latitude/longitude (full)
  return {
    latitude: item?.geometry?.location?.latitude ?? item?.geometry?.location?.lat,
    longitude: item?.geometry?.location?.longitude ?? item?.geometry?.location?.lng,
  };
};

const useRestaurantResults = ({ restaurants, userLocation, query, active }) => {
  const withUserMetrics = useMemo(() => {
    if (!Array.isArray(restaurants)) {
      return [];
    }

    if (!userLocation || !hasCoordinate({ geometry: { location: userLocation } })) {
      return restaurants;
    }

    return restaurants.map((item) => {
      const destination = buildDestination(item);
      const distanceMeters = calculateDistanceMeters(userLocation, destination);

      return {
        ...item,
        userDistanceMeters: distanceMeters,
        userDistanceText: formatDistanceText(distanceMeters),
      };
    });
  }, [restaurants, userLocation]);

  const sorted = useMemo(() => {
    return [...withUserMetrics].sort((a, b) => {
      const aDistance = Number.isFinite(a.userDistanceMeters)
        ? a.userDistanceMeters
        : Number.isFinite(a.distance_value)
        ? a.distance_value
        : INFINITY_DISTANCE;
      const bDistance = Number.isFinite(b.userDistanceMeters)
        ? b.userDistanceMeters
        : Number.isFinite(b.distance_value)
        ? b.distance_value
        : INFINITY_DISTANCE;

      if (aDistance === bDistance) {
        return 0;
      }

      return aDistance - bDistance;
    });
  }, [withUserMetrics]);

  const filtered = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    const activeSet = active || {};

    return sorted.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
      
      // Price filtering - check if price symbol is in the price array
      // If price filter is not set or empty, show all prices
      const priceMatch = !activeSet.price || activeSet.price.length === 0
        ? true 
        : (Number(item.priceLevel) === 1 && activeSet.price.includes("$")) ||
          (Number(item.priceLevel) === 2 && activeSet.price.includes("$$")) ||
          (Number(item.priceLevel) === 3 && activeSet.price.includes("$$$")) ||
          (Number(item.priceLevel) === 4 && activeSet.price.includes("$$$$"));

      // Distance filtering - use userDistanceMeters converted to miles
      let distanceMatch = true;
      if (
        activeSet.distance && 
        activeSet.distance.min !== undefined && 
        activeSet.distance.max !== undefined &&
        typeof activeSet.distance.min === 'number' &&
        typeof activeSet.distance.max === 'number'
      ) {
        // Check if this is a restrictive filter (not the default 0-5)
        const isDefaultFilter = activeSet.distance.min === 0 && activeSet.distance.max === 5;
        
        // If distance filter is set, we need distance information
        if (userLocation && Number.isFinite(item.userDistanceMeters)) {
          // Convert meters to miles (1 mile = 1609.34 meters)
          const distanceMiles = item.userDistanceMeters / 1609.34;
          distanceMatch = distanceMiles >= activeSet.distance.min && distanceMiles <= activeSet.distance.max;
        } else {
          // If user location is not available or distance cannot be calculated:
          // - Allow through if it's the default filter (0-5 miles) - user hasn't customized it
          // - Filter out if it's a restrictive filter - user has set a specific range
          distanceMatch = isDefaultFilter;
        }
      }

      // Location filtering (Near Campus)
      const locationMatch = activeSet.location?.includes("Near Campus")
        ? item.distance_value && item.distance_value <= 1000
        : true;

      return nameMatch && priceMatch && distanceMatch && locationMatch;
    });
  }, [sorted, query, active, userLocation]);

  const withCoordinates = useMemo(
    () => filtered.filter((item) => hasCoordinate(item)),
    [filtered]
  );

  return {
    restaurants: withUserMetrics,
    sorted,
    filtered,
    restaurantsWithCoordinates: withCoordinates,
  };
};

export default useRestaurantResults;
