import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export default function DistanceFilter() {
  const MIN = 0;
  const MAX = 10;
  const STEP = 0.5;

  // Store both numeric and string versions
  const [minDistance, setMinDistance] = useState(MIN);
  const [maxDistance, setMaxDistance] = useState(MAX);
  const [minInput, setMinInput] = useState(MIN.toString());
  const [maxInput, setMaxInput] = useState(MAX.toString());

  // Sync sliders when numeric values change
  useEffect(() => {
    setMinInput(minDistance.toString());
    setMaxInput(maxDistance.toString());
  }, [minDistance, maxDistance]);

  // Handle min input change
  const handleMinInput = (val) => {
    setMinInput(val); // store string for typing
    const num = parseFloat(val);
    if (!isNaN(num)) {
      let newVal = Math.max(MIN, Math.min(num, maxDistance));
      setMinDistance(newVal);
    }
  };

  // Handle max input change
  const handleMaxInput = (val) => {
    setMaxInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      let newVal = Math.min(MAX, Math.max(num, minDistance));
      setMaxDistance(newVal);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Distance: {minDistance} – {maxDistance} miles
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={minInput}
          onChangeText={handleMinInput}
        />
        <Text style={{ marginHorizontal: 8 }}>to</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={maxInput}
          onChangeText={handleMaxInput}
        />
      </View>

      <Text style={{ marginTop: 16 }}>Min Distance</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        value={minDistance}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007AFF"
        onValueChange={(val) => setMinDistance(val)}
      />

      <Text style={{ marginTop: 16 }}>Max Distance</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        value={maxDistance}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007AFF"
        onValueChange={(val) => setMaxDistance(val)}
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
    fontWeight: "500",
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    width: 70,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
  },
});
