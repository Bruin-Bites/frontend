import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const priceLevels = [1, 2, 3, 4];

export default function PriceFilter() {
  const [selectedLevels, setSelectedLevels] = useState([]);

  const getPriceSymbol = (level) => {
    return "$".repeat(level);
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((item) => item !== level)
        : [...prev, level]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedLevels.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleLevel(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{getPriceSymbol(item)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price Level</Text>
      <FlatList
        data={priceLevels}
        keyExtractor={(item) => item.toString()}
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
