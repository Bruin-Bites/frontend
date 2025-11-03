import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export default function PriceFilter() {
  const MIN = 0;
  const MAX = 250;
  const STEP = 5; // step size in dollars

  const [minPrice, setMinPrice] = useState(MIN);
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [sliderMin, setSliderMin] = useState(minPrice);
  const [sliderMax, setSliderMax] = useState(maxPrice);

  // Sync slider values when inputs change
  useEffect(() => {
    if (sliderMin !== minPrice) setSliderMin(minPrice);
    if (sliderMax !== maxPrice) setSliderMax(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle input change with validation
  const handleMinChange = (val) => {
    let num = Number(val);
    if (!isNaN(num)) {
      if (num < MIN) num = MIN;
      if (num > maxPrice) num = maxPrice;
      setMinPrice(num);
    }
  };

  const handleMaxChange = (val) => {
    let num = Number(val);
    if (!isNaN(num)) {
      if (num > MAX) num = MAX;
      if (num < minPrice) num = minPrice;
      setMaxPrice(num);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Price: ${minPrice} – ${maxPrice}
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={minPrice.toString()}
          onChangeText={handleMinChange}
        />
        <Text style={{ marginHorizontal: 8 }}>to</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={maxPrice.toString()}
          onChangeText={handleMaxChange}
        />
      </View>

      <Text style={{ marginTop: 16 }}>Min Price</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        value={sliderMin}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007AFF"
        onValueChange={(val) => setMinPrice(val)}
      />

      <Text style={{ marginTop: 16 }}>Max Price</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        value={sliderMax}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007AFF"
        onValueChange={(val) => setMaxPrice(val)}
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
