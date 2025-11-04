import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import Filter from "./components/Filter";

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

const FilterPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Filter></Filter>
    </View>
  );
}

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

export default FilterPage;
