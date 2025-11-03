import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import PriceFilter from "./PriceFilter";
import DistanceFilter from "./DistanceFilter";
import DietaryFilter from "./DietaryPreferences";
import DealTypes from "./DealTypes";
import LocationType from "./LocationType";
import FoodType from "./FoodType";
import DateFilter from "./DateFilter";

const filters = ["All", "Trending", "Music", "Sports", "Tech", "Art", "Movies", "Food", "Travel", "News", "Gaming", "Education"];

export default function Filter() {
  const [selected, setSelected] = useState("All");

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <Text>Filters</Text>
        <Pressable onPress={() => console.log("Close")}>
            <Text>✕</Text>
        </Pressable>
      </View>


      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <PriceFilter></PriceFilter>
        <DistanceFilter></DistanceFilter>
        <DietaryFilter></DietaryFilter>
        <DealTypes></DealTypes>
        <LocationType></LocationType>
        <FoodType></FoodType>
        <DateFilter></DateFilter>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.applyButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.applyText}>Apply</Text>
      </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingVertical: 8,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#333",
    fontSize: 16,
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  filterHeader: {
    flexDirection: "row",        // horizontal layout
    justifyContent: "space-between", // push items to the ends
    alignItems: "center",        // vertically center items
    paddingHorizontal: 16,       // optional padding
    height: 50, 
    backgroundColor: "lightgray",
  },
});
