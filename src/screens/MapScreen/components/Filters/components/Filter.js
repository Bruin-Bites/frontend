import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import PriceFilter from "./PriceFilter";
import DistanceFilter from "./DistanceFilter";
import DietaryFilter from "./DietaryPreferences";
import DealTypes from "./DealTypes";
import LocationType from "./LocationType";
import FoodType from "./FoodType";
import DateFilter from "./DateFilter";

export default function Filter({ 
  filters,
  activeFilters,
  onUpdateFilters,
  onClose, 
  onApply,
  onReset }) {

  const oldFilters = structuredClone(activeFilters);

  const handleReset = () => {
    console.log("Reset filters");
    if (onReset) {
      onReset();
    }
  };

  const handleApply = () => {
    console.log("Apply filters");
    if (onApply) {
      onApply();
      
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose(oldFilters);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <Text style={styles.headerText}>Filters</Text>
        <Pressable onPress={handleClose}>
          <Text style={styles.closeButton}>✕</Text>
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <PriceFilter filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <DistanceFilter filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <DietaryFilter filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <DealTypes filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <LocationType filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <FoodType filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
        <DateFilter filters = {filters} activeFilters = {activeFilters} onUpdateFilters = {onUpdateFilters} />
      </ScrollView>

      {/* Buttons at the bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={handleApply}
          activeOpacity={0.7}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "lightgray",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
