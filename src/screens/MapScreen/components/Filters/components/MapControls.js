import React from "react";
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const MapControls = ({
  query,
  onQueryChange,
  filters,
  activeFilters,
  onToggleFilter,
  mapMode,
  onChangeMapMode,
}) => {
  return (
    <>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#667" />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search places, cuisine, or deals…"
          placeholderTextColor="#99A3AD"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#99A3AD" />
          </Pressable>
        )}
      </View>

      <View style={styles.chipsRow}>
        {filters.map((label) => {
          const active = activeFilters.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => onToggleFilter(label)}
              style={[styles.chip, active && styles.chipOn]}
            >
              <View style={[styles.dot, active && { backgroundColor: "#fff" }]} />
              <Text style={[styles.chipText, active && { color: "#fff" }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mapToggleRow}>
        <Pressable
          style={[
            styles.mapToggleButton,
            mapMode === "native" && styles.mapToggleButtonOn,
          ]}
          onPress={() => onChangeMapMode("native")}
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
          onPress={() => onChangeMapMode("google")}
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
    </>
  );
};

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
});

export default MapControls;
