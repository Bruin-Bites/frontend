const EARTH_RADIUS_METERS = 6371e3;

const toRadians = (value) => (value * Math.PI) / 180;

export const calculateDistanceMeters = (origin, destination) => {
  if (
    !origin ||
    !destination ||
    !Number.isFinite(origin.latitude) ||
    !Number.isFinite(origin.longitude) ||
    !Number.isFinite(destination.latitude) ||
    !Number.isFinite(destination.longitude)
  ) {
    return null;
  }

  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);
  const deltaLat = toRadians(destination.latitude - origin.latitude);
  const deltaLng = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};

export const formatDistanceText = (meters) => {
  if (!Number.isFinite(meters) || meters < 0) {
    return null;
  }

  const miles = meters / 1609.34;

  if (miles >= 10) {
    return `${Math.round(miles)} mi`;
  }

  if (miles >= 0.1) {
    return `${miles.toFixed(1)} mi`;
  }

  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }

  if (meters >= 1) {
    return `${Math.round(meters)} m`;
  }

  return "<1 m";
};
