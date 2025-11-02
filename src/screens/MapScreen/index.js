import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  Platform,
  Alert,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapControls from "./components/MapControls";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantMarkers from "./components/RestaurantMarkers";
import useRestaurantList from "../../hooks/useRestaurantList";
import useUserLocation from "./hooks/useUserLocation";
import useRestaurantResults from "./hooks/useRestaurantResults";

const FILTER_OPTIONS = [
  "$",
  "$$",
  "$$$",
  "$$$$",
  "Happy Hour",
  "Near Campus",
  "Vegetarian",
  "Open Now",
];

const MapScreen = () => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(["Near Campus"]);
  const [mapMode, setMapMode] = useState("native");
  const [selectedId, setSelectedId] = useState(null);
  const [transientError, setTransientError] = useState(null);
  const mapRef = useRef(null);
  const lastFitSignatureRef = useRef(null);

  const { restaurants, loading } = useRestaurantList();
  const { userLocation, locationError } = useUserLocation();

  const { filtered, restaurantsWithCoordinates } = useRestaurantResults({
    restaurants,
    userLocation,
    query,
    active: activeFilters,
  });

  const mapProvider = useMemo(
    () =>
      mapMode === "google" && Platform.OS !== "web"
        ? PROVIDER_GOOGLE
        : undefined,
    [mapMode]
  );

  const fitSignature = useMemo(() => {
    if (!restaurantsWithCoordinates.length) {
      return null;
    }

    return restaurantsWithCoordinates
      .map((item) => {
        const id = item._id || item.id || item.place_id || item.name;
        const lat = item?.geometry?.location?.lat;
        const lng = item?.geometry?.location?.lng;
        return `${id ?? "unknown"}:${lat ?? "?"},${lng ?? "?"}`;
      })
      .join("|");
  }, [restaurantsWithCoordinates]);

  useEffect(() => {
    if (fitSignature === null || !mapRef.current) {
      return;
    }

    if (lastFitSignatureRef.current === fitSignature) {
      return;
    }

    const coordinates = restaurantsWithCoordinates
      .map((item) => ({
        latitude: item?.geometry?.location?.lat,
        longitude: item?.geometry?.location?.lng,
      }))
      .filter(
        (point) =>
          Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
      );

    if (coordinates.length === 0) {
      return;
    }

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        350
      );
      lastFitSignatureRef.current = fitSignature;
      return;
    }

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 80, right: 40, bottom: 320, left: 40 },
      animated: true,
    });
    lastFitSignatureRef.current = fitSignature;
  }, [fitSignature, restaurantsWithCoordinates, mapMode]);

  useEffect(() => {
    lastFitSignatureRef.current = null;
  }, [mapMode]);

  const toggleFilter = useCallback((label) => {
    setActiveFilters((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }, []);

  const handleSelectRestaurant = useCallback(
    (item) => {
      if (!item) {
        return;
      }
      const id = item._id || item.id || item.place_id || item.name;
      setSelectedId(id);
      const lat = item?.geometry?.location?.lat;
      const lng = item?.geometry?.location?.lng;
      if (
        lat === undefined ||
        lng === undefined ||
        !mapRef.current ||
        typeof mapRef.current.animateToRegion !== "function"
      ) {
        return;
      }
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        250
      );
    },
    [setSelectedId]
  );

  const handleNavigate = useCallback(
    (restaurant) => {
      if (!restaurant) {
        return;
      }
      setTransientError(null);
      const lat = restaurant?.geometry?.location?.lat;
      const lng = restaurant?.geometry?.location?.lng;
      const hasCoords =
        typeof lat === "number" &&
        !Number.isNaN(lat) &&
        typeof lng === "number" &&
        !Number.isNaN(lng);
      const destinationLabel =
        typeof restaurant.address === "string" &&
        restaurant.address.trim().length > 0
          ? restaurant.address.trim()
          : hasCoords
          ? `${lat},${lng}`
          : null;
      if (!destinationLabel) {
        setTransientError("Missing destination details for this restaurant.");
        return;
      }
      const origin =
        userLocation && typeof userLocation.latitude === "number"
          ? `${userLocation.latitude},${userLocation.longitude}`
          : null;
      const url = Platform.select({
        ios: `http://maps.apple.com/?daddr=${encodeURIComponent(
          destinationLabel
        )}${origin ? `&saddr=${encodeURIComponent(origin)}` : ""}`,
        android: `google.navigation:q=${encodeURIComponent(destinationLabel)}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          destinationLabel
        )}${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`,
      });
      if (!url) {
        setTransientError("This device cannot open navigation links.");
        return;
      }
      Linking.openURL(url).catch(() => {
        setTransientError("Unable to open navigation on this device.");
      });
    },
    [userLocation]
  );

  const confirmNavigate = useCallback(
    (restaurant) => {
      if (!restaurant) {
        return;
      }
      Alert.alert(
        "Get directions",
        `Do you want to get the direction to ${restaurant.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => handleNavigate(restaurant) },
        ]
      );
    },
    [handleNavigate]
  );

  const errorMessage = transientError || locationError;

  const renderItem = useCallback(
    ({ item }) => {
      const id = item._id || item.id || item.place_id || item.name;
      return (
        <RestaurantCard
          item={item}
          selected={id === selectedId}
          onPress={() => {
            confirmNavigate(item);
            handleSelectRestaurant(item);
          }}
        />
      );
    },
    [confirmNavigate, handleSelectRestaurant, selectedId]
  );

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MapControls
        query={query}
        onQueryChange={setQuery}
        filters={FILTER_OPTIONS}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        mapMode={mapMode}
        onChangeMapMode={setMapMode}
      />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={mapProvider}
          style={styles.map}
          initialRegion={{
            latitude: userLocation?.latitude || 34.0689,
            longitude: userLocation?.longitude || -118.4452,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          <RestaurantMarkers
            restaurants={restaurantsWithCoordinates}
            selectedId={selectedId}
            onSelect={handleSelectRestaurant}
            onNavigate={confirmNavigate}
          />
        </MapView>
        {errorMessage && (
          <Text style={styles.mapErrorText}>{errorMessage}</Text>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) =>
          item._id || item.id || item.place_id || item.name
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 280,
  },
  mapErrorText: {
    padding: 8,
    fontSize: 12,
    textAlign: "center",
    color: "#A33",
    backgroundColor: "rgba(255,0,0,0.08)",
  },
});

export default MapScreen;
