import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function PriceFilter({ filters, activeFilters, onUpdateFilters }) {
  const priceSymbols = Array.isArray(filters?.price) && filters.price.length > 0
    ? filters.price
    : ["$", "$$", "$$$", "$$$$"];

  const [selectedSymbols, setSelectedSymbols] = useState(
    Array.isArray(activeFilters?.price) && activeFilters.price.length > 0
      ? activeFilters.price
      : priceSymbols
  );

  // Sync local state when parent-provided filters change (e.g., Reset)
  useEffect(() => {
    if (Array.isArray(activeFilters?.price)) {
      setSelectedSymbols(activeFilters.price);
    }
  }, [activeFilters?.price, priceSymbols]);

  const toggleSymbol = (symbol) => {
    const next = selectedSymbols.includes(symbol)
      ? selectedSymbols.filter((s) => s !== symbol)
      : [...selectedSymbols, symbol];
    
    setSelectedSymbols(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, price: next });
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedSymbols.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleSymbol(item)}
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
      <Text style={styles.label}>Price</Text>
      <FlatList
        data={priceSymbols}
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
    width: "100%",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 8,
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
