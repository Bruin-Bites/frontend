import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const foodTypes = [
  "Fast Food",
  "Coffee & Drinks",
  "Dessert",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Buffet",
];

export default function FoodType({ onSelect }) {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (type) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    onSelect?.(updated); // pass updated selection to parent
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTypes.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleType(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Food Types</Text>
      <FlatList
        data={foodTypes}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: 200,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkMark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
