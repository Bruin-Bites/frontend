import { useMemo } from "react";
import {
  calculateDistanceMeters,
  formatDistanceText,
} from "../../../utils/geo";

const INFINITY_DISTANCE = Number.POSITIVE_INFINITY;
const PRICE_FILTERS = ["$", "$$", "$$$", "$$$$"];

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
    const activeSet = active || [];

    const anyPriceActive = PRICE_FILTERS.some((price) =>
      activeSet.includes(price)
    );

    return sorted.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerQuery);

      const priceMatches =
        !anyPriceActive ||
        (Number(item.priceLevel) === 1 && activeSet.includes("$")) ||
        (Number(item.priceLevel) === 2 && activeSet.includes("$$")) ||
        (Number(item.priceLevel) === 3 && activeSet.includes("$$$")) ||
        (Number(item.priceLevel) === 4 && activeSet.includes("$$$$"));

      const nearCampusMatch = activeSet.includes("Near Campus")
        ? item.distance_value && item.distance_value <= 1000
        : true;

      return nameMatch && priceMatches && nearCampusMatch;
    });
  }, [sorted, query, active]);

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
