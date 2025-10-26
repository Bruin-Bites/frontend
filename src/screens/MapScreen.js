import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "../theme/colors";
// import restaurant data hook
import useRestaurantList from "../hooks/useRestaurantList";

export default function MapScreen() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(["Near Campus"]);
  // CHANGE: Track which map provider is active and which restaurant is selected
  const [mapMode, setMapMode] = useState("native");
  const [selectedId, setSelectedId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  // use restaurant data hook
  const { restaurants, loading } = useRestaurantList();

  const filters = [
    "$",
    "$$",
    "$$$",
    "$$$$",
    "Happy Hour",
    "Near Campus",
    "Vegetarian",
    "Open Now",
  ];

  // Sort by distance (closest first)
  const sorted = [...restaurants].sort(
    (a, b) => (a.distance_value || 999999) - (b.distance_value || 999999)
  );

  // Applying the filter above with the google maps distance filters and search
  const filtered = sorted.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(q.toLowerCase());

    //filter by price level
    const anyPriceActive = ["$", "$$", "$$$", "$$$$"].some(p => active.includes(p));

    const priceOne = item.priceLevel == 1 && active.includes("$");
    const priceTwo = item.priceLevel == 2 && active.includes("$$");
    const priceThree = item.priceLevel == 3 && active.includes("$$$");
    const priceFour = item.priceLevel == 4 && active.includes("$$$$");

    const priceMatch = anyPriceActive
      ? priceOne || priceTwo || priceThree || priceFour
      : true;

    // Near Campus (less than or equal to 1 km)
    const nearCampusMatch = active.includes("Near Campus")
      ? item.distance_value && item.distance_value <= 1000 // meters
      : true;

    return nameMatch && priceMatch && nearCampusMatch;
  });

  // Filter restaurants that have valid coordinates
  const restaurantsWithCoordinates = useMemo(
    () =>
      filtered.filter(
        (item) =>
          item.geometry?.location?.lat !== undefined &&
          item.geometry?.location?.lng !== undefined
      ),
    [filtered]
  );

  // Determine map provider based on selected mode and platform
  const mapProvider =
    mapMode === "google" && Platform.OS !== "web" ? PROVIDER_GOOGLE : undefined;

  useEffect(() => {
    // CHANGE: Request user location so we can show it on the map and support navigation
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permission to access location was denied.");
          return;
        }
        const current = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (error) {
        setLocationError(error?.message || "Failed to fetch user location.");
      }
    })();
  }, []);

  useEffect(() => {
    // CHANGE: Fit the map camera to show filtered restaurant markers
    if (!mapRef.current) return;
    const coordinates = restaurantsWithCoordinates.map((item) => ({
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    }));
    if (coordinates.length === 0) return;
    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        350
      );
      return;
    }
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 80, right: 40, bottom: 320, left: 40 },
      animated: true,
    });
  }, [restaurantsWithCoordinates, mapMode]);

  // CHANGE: Handle navigation to selected restaurant using address + user origin
  const handleNavigate = (restaurant) => {
    if (!restaurant) return;
    const lat = restaurant.geometry?.location?.lat;
    const lng = restaurant.geometry?.location?.lng;
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
      setLocationError("Missing destination details for this restaurant.");
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
    if (!url) return;
    Linking.openURL(url).catch(() => {
      setLocationError("Unable to open navigation on this device.");
    });
  };

  const handleSelectRestaurant = (item) => {
    // CHANGE: Centralize selection so markers and cards stay in sync
    const id = item._id || item.id || item.place_id || item.name;
    setSelectedId(id);
    const lat = item.geometry?.location?.lat;
    const lng = item.geometry?.location?.lng;
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
  };

  const confirmNavigate = (restaurant) => {
    if (!restaurant) return;
    Alert.alert(
      "Get directions",
      `Do you want to get the direction to ${restaurant.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleNavigate(restaurant) },
      ]
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading restaurants...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#667" />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search places, cuisine, or deals…"
          placeholderTextColor="#99A3AD"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {q.length > 0 && (
          <Pressable onPress={() => setQ("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#99A3AD" />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.chipsRow}>
        {filters.map((label) => {
          const on = active.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() =>
                setActive(
                  on ? active.filter((x) => x !== label) : [...active, label]
                )
              }
              style={[styles.chip, on && styles.chipOn]}
            >
              <View style={[styles.dot, on && { backgroundColor: "#fff" }]} />
              <Text style={[styles.chipText, on && { color: "#fff" }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Map provider toggle buttons */}
      <View style={styles.mapToggleRow}>
        <Pressable
          style={[
            styles.mapToggleButton,
            mapMode === "native" && styles.mapToggleButtonOn,
          ]}
          onPress={() => setMapMode("native")}
        >
          <Text
            style={[
              styles.mapToggleText,
              mapMode === "native" && styles.mapToggleTextOn,
            ]}
          >
            Your Local Device Map
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.mapToggleButton,
            mapMode === "google" && styles.mapToggleButtonOn,
          ]}
          onPress={() => setMapMode("google")}
        >
          <Text
            style={[
              styles.mapToggleText,
              mapMode === "google" && styles.mapToggleTextOn,
            ]}
          >
            Google Maps
          </Text>
        </Pressable>
      </View>

      {/* Render map view with restaurant pins */}
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
          {restaurantsWithCoordinates.map((item) => {
            const lat = item.geometry.location.lat;
            const lng = item.geometry.location.lng;
            const id = item._id || item.id || item.place_id || item.name;
            return (
              // CHANGE: Render custom callout so users can grab directions directly
              <Marker
                key={id}
                coordinate={{ latitude: lat, longitude: lng }}
                pinColor={id === selectedId ? colors.uclaGold : colors.uclaBlue}
                onPress={() => handleSelectRestaurant(item)}
                onCalloutPress={() => confirmNavigate(item)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName}>{item.name}</Text>
                    <Text style={styles.calloutAddress}>
                      {item.address || "Address unavailable"}
                    </Text>
                    <Text
                      style={[
                        styles.calloutButtonText,
                        { color: colors.uclaBlue },
                      ]}
                    >
                      Get Directions →
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        {/* Show location error */}
        {locationError && (
          <Text style={styles.mapErrorText}>{locationError}</Text>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id || i.id || i.place_id || i.name}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              (item._id || item.id || item.place_id || item.name) ===
                selectedId && styles.cardSelected,
            ]}
            onPress={(event) => {
              event.stopPropagation();
              confirmNavigate(item);
              handleSelectRestaurant(item);
            }}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={22}
                color={colors.uclaBlue}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                ⭐ {item.rating || "N/A"} • 🚗 {item.distance_text} • ⏱{" "}
                {item.duration_text}
              </Text>
              <Text style={styles.deal}>
                {item.address || "Address not marked "}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#88939E" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.25)",
    backgroundColor: "#F7FAFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#223" },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.uclaBlue,
    backgroundColor: "#fff",
    gap: 6,
  },
  chipOn: {
    backgroundColor: colors.uclaBlue,
    borderColor: colors.uclaBlue,
  },
  chipText: { fontSize: 12, fontWeight: "700", color: colors.uclaBlue },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.uclaGold,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.uclaGold,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 16, fontWeight: "800", color: "#1B2430" },
  meta: { fontSize: 12, color: "#5F6C7B", marginTop: 2 },
  deal: { fontSize: 12, color: "#223", marginTop: 6, fontWeight: "600" },
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
  mapToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mapToggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.uclaBlue,
    alignItems: "center",
  },
  mapToggleButtonOn: {
    backgroundColor: colors.uclaBlue,
  },
  mapToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.uclaBlue,
  },
  mapToggleTextOn: {
    color: "#fff",
  },
  navigateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.uclaBlue,
    marginLeft: 8,
  },
  navigateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  mapErrorText: {
    padding: 8,
    fontSize: 12,
    textAlign: "center",
    color: "#A33",
    backgroundColor: "rgba(255,0,0,0.08)",
  },
  callout: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  calloutName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  calloutAddress: {
    fontSize: 12,
    color: "#4E5D6A",
  },
  calloutButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.uclaBlue,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  calloutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
