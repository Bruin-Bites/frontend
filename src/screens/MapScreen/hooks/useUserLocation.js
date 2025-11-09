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

      // Request high accuracy location with timeout
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000, // 10 second timeout
        maximumAge: 0, // Don't use cached location
      });
            
      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error?.message || "Failed to fetch user location.");
      
      // If location fails, check if we're in a simulator/emulator
      // In development, location might be mocked or unavailable
      if (__DEV__) {
        console.warn("Location fetch failed. If you're in a simulator, location may be mocked.");
      }
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
