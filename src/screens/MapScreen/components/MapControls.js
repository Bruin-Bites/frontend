import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const MapControls = ({
  filters,
  activeFilters,
  onToggleFilter,
  mapMode,
  onChangeMapMode,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        {onClose && (
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={22} color="#364152" />
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionLabel}>Popular</Text>
      <View style={styles.chipsRow}>
        {filters.map((label) => {
          const active = activeFilters.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => onToggleFilter(label)}
              style={[styles.chip, active && styles.chipOn]}
            >
              <View
                style={[styles.dot, active && { backgroundColor: "#fff" }]}
              />
              <Text style={[styles.chipText, active && { color: "#fff" }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
        Map provider
      </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1C2534",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#59616D",
  },
  sectionSpacing: {
    marginTop: 20,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
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
    marginTop: 12,
  },
  mapToggleButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.uclaBlue,
    alignItems: "center",
    backgroundColor: "#fff",
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
