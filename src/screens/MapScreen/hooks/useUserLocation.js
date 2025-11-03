import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied.");
      }
      return true;
    } catch (error) {
      setLocationError(error?.message || "Unable to request location access.");
      return false;
    }
  }, []);

  const fetchUserLocation = useCallback(async () => {
    if (isRequesting) {
      return;
    }

    setIsRequesting(true);
    setLocationError(null);

    try {
      const permitted = await requestLocationPermission();
      if (!permitted) {
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch (error) {
      setLocationError(error?.message || "Failed to fetch user location.");
    } finally {
      setIsRequesting(false);
    }
  }, [isRequesting, requestLocationPermission]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  return {
    userLocation,
    locationError,
    isRequesting,
    refreshLocation: fetchUserLocation,
  };
};

export default useUserLocation;
