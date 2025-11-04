import { useMemo } from "react";
import {
  calculateDistanceMeters,
  formatDistanceText,
} from "../../../utils/geo";

const INFINITY_DISTANCE = Number.POSITIVE_INFINITY;

const hasCoordinate = (item) =>
  item?.geometry?.location?.lat !== undefined &&
  item?.geometry?.location?.lng !== undefined;

const buildDestination = (item) => ({
  latitude: item?.geometry?.location?.lat,
  longitude: item?.geometry?.location?.lng,
});

const useRestaurantResults = ({ restaurants, userLocation, query, active }) => {
  const withUserMetrics = useMemo(() => {
    if (!Array.isArray(restaurants)) {
      return [];
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
      if (activeSet.distance && activeSet.distance.min !== undefined && activeSet.distance.max !== undefined) {
        if (userLocation && Number.isFinite(item.userDistanceMeters)) {
          // Convert meters to miles (1 mile = 1609.34 meters)
          const distanceMiles = item.userDistanceMeters / 1609.34;
          distanceMatch = distanceMiles >= activeSet.distance.min && distanceMiles <= activeSet.distance.max;
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
