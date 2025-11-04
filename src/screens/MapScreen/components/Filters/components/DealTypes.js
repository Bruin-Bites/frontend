import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const dealOptions = [
  "Buy one get one free (BOGO)",
  "First come first serve (FCFS)",
  "Free Item",
  "% off discount",
  "Student Discount",
  "Combo Deal",
  "Rewards/points bonus",
  "Coupon"
];

export default function DealTypes() {
  const [selectedDeals, setSelectedDeals] = useState([]);

  const toggleDeal = (deal) => {
    setSelectedDeals((prev) =>
      prev.includes(deal)
        ? prev.filter((item) => item !== deal)
        : [...prev, deal]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedDeals.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleDeal(item)}
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
      <Text style={styles.label}>Deal Type</Text>
      <FlatList
        data={dealOptions}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        scrollEnabled={false} // set to true if you have many deals
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
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
