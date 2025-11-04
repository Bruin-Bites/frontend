import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const dateOptions = ["Tomorrow", "This Week"];

export default function DateFilter({ onSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect?.(option); // pass selection to parent
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedOption === item;
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <FlatList
        data={dateOptions}
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10, // make it circular
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

