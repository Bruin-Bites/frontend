import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
// import restaurant data hook
import useRestaurantList from "../hooks/useRestaurantList";

export default function MapScreen() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(["Near Campus"]);
  // use restaurant data hook
  const { restaurants, loading } = useRestaurantList();

  const filters = [
    "≤ $8",
    "Happy Hour",
    "Near Campus",
    "Vegetarian",
    "Open Now",
  ];

  // Sort by distance (closest first)
  const sorted = [...restaurants].sort(
    (a, b) => (a.distance_value || 999999) - (b.distance_value || 999999)
  );

  // const filtered = restaurants.filter((item) => {
  //   const okQ = item.name.toLowerCase().includes(q.toLowerCase());
  //   const okPrice = active.includes("≤ $8") ? item.price === "$" : true;
  //   const okNear = active.includes("Near Campus")
  //     ? item.dist.endsWith("mi") && parseFloat(item.dist) <= 0.6
  //     : true;
  //   return okQ && okPrice && okNear;
  // });

  // This is the Mongoose schema for restaurants on the backend so you know what fields are available
  // if you want to call it from backend, then use item.<fieldname>
  //const restaurantSchema = new mongoose.Schema({
  //   name: String,
  //   address: String,
  //   rating: Number,
  //   place_id: String,
  //   types: [String],
  //   geometry: {
  //     location: {
  //       lat: Number,
  //       lng: Number,
  //     },
  //   },
  // });

  // Applying the filter above with the google maps distance filters and search
  const filtered = sorted.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(q.toLowerCase());

    // ≤ $8 <-- how could we get the price for each restaurant tho...
    const priceMatch = active.includes("≤ $8")
      ? item.price_level && item.price_level <= 1
      : true;

    // Near Campus (less than or equal to 1 km)
    const nearCampusMatch = active.includes("Near Campus")
      ? item.distance_value && item.distance_value <= 1000 // meters
      : true;

    return nameMatch && priceMatch && nearCampusMatch;
  });

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

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id || i.id || i.place_id || i.name}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
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
});

/*import React from "react";
import { View, Text } from "react-native";

export default function MapScreen() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Cheap Eats Map (placeholder)
      </Text>
      <Text>Filters: cuisine • price • distance</Text>
    </View>
  );
}*/
