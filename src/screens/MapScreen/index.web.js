import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Linking } from "react-native";
import MapControls from "./components/MapControls";
import RestaurantCard from "./components/RestaurantCard";
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

  const { restaurants, loading } = useRestaurantList();
  const { userLocation, locationError } = useUserLocation();

  const { filtered } = useRestaurantResults({
    restaurants,
    userLocation,
    query,
    active: activeFilters,
  });

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const confirmNavigate = (item) => {
    const address = item.address || item.vicinity;
    if (!address) {
      alert("No address available for this restaurant");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url);
  };

  const handleSelectRestaurant = (item) => {
    const id = item._id || item.id || item.place_id || item.name;
    setSelectedId(id === selectedId ? null : id);
  };

  const renderItem = ({ item }) => {
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
  };

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
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <Text style={styles.webMapText}>Map view not available on web</Text>
          <Text style={styles.webMapSubtext}>Please use the list view below</Text>
        </View>
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
  webMapPlaceholder: {
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default MapScreen;
