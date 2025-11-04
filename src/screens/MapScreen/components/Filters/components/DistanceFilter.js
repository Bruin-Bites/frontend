import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, PanResponder, TextInput } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MIN = 0;
const MAX = 50;
const CONTAINER_PADDING = 16;
const SLIDER_PADDING = 24;
const TRACK_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2 - SLIDER_PADDING * 2;
const THUMB_SIZE = 20;

export default function DistanceFilter() {
  const [minDistance, setMinDistance] = useState(1);
  const [maxDistance, setMaxDistance] = useState(40);
  const [activeThumb, setActiveThumb] = useState(null); // 'min' or 'max' or null
  const [minInput, setMinInput] = useState("1");
  const [maxInput, setMaxInput] = useState("40");

  // Format distance text (singular/plural)
  const formatDistance = (value) => {
    return value === 1 ? `${value} Mile` : `${value} Miles`;
  };

  // Sync inputs when slider values change
  useEffect(() => {
    setMinInput(minDistance.toString());
  }, [minDistance]);

  useEffect(() => {
    setMaxInput(maxDistance.toString());
  }, [maxDistance]);

  const getPositionFromValue = (value) => {
    return ((value - MIN) / (MAX - MIN)) * (TRACK_WIDTH - THUMB_SIZE);
  };

  const getValueFromPosition = (position) => {
    const value = Math.round((position / (TRACK_WIDTH - THUMB_SIZE)) * (MAX - MIN) + MIN);
    return Math.max(MIN, Math.min(MAX, value));
  };

  const handleMinInputChange = (text) => {
    setMinInput(text);
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      const clampedValue = Math.max(MIN, Math.min(num, maxDistance - 1));
      setMinDistance(clampedValue);
    }
  };

  const handleMaxInputChange = (text) => {
    setMaxInput(text);
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      const clampedValue = Math.min(MAX, Math.max(num, minDistance + 1));
      setMaxDistance(clampedValue);
    }
  };

  const handleMinBlur = () => {
    const num = parseInt(minInput, 10);
    if (isNaN(num) || num < MIN) {
      setMinDistance(MIN);
      setMinInput(MIN.toString());
    } else if (num >= maxDistance) {
      setMinDistance(maxDistance - 1);
      setMinInput((maxDistance - 1).toString());
    } else {
      setMinDistance(num);
      setMinInput(num.toString());
    }
  };

  const handleMaxBlur = () => {
    const num = parseInt(maxInput, 10);
    if (isNaN(num) || num > MAX) {
      setMaxDistance(MAX);
      setMaxInput(MAX.toString());
    } else if (num <= minDistance) {
      setMaxDistance(minDistance + 1);
      setMaxInput((minDistance + 1).toString());
    } else {
      setMaxDistance(num);
      setMaxInput(num.toString());
    }
  };

  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setActiveThumb("min");
    },
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPositionFromValue(minDistance) + gestureState.dx;
      const newValue = getValueFromPosition(newPosition);
      if (newValue >= MIN && newValue < maxDistance) {
        setMinDistance(newValue);
      }
    },
    onPanResponderRelease: () => {
      setActiveThumb(null);
    },
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setActiveThumb("max");
    },
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPositionFromValue(maxDistance) + gestureState.dx;
      const newValue = getValueFromPosition(newPosition);
      if (newValue <= MAX && newValue > minDistance) {
        setMaxDistance(newValue);
      }
    },
    onPanResponderRelease: () => {
      setActiveThumb(null);
    },
  });

  const handleTrackPress = (evt) => {
    const x = evt.nativeEvent.locationX - SLIDER_PADDING;
    const newValue = getValueFromPosition(x);
    
    if (Math.abs(newValue - minDistance) < Math.abs(newValue - maxDistance)) {
      // Closer to min thumb
      if (newValue < maxDistance) {
        setMinDistance(newValue);
      }
    } else {
      // Closer to max thumb
      if (newValue > minDistance) {
        setMaxDistance(newValue);
      }
    }
  };

  const minPosition = getPositionFromValue(minDistance);
  const maxPosition = getPositionFromValue(maxDistance);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Distance</Text>

      {/* Text inputs row */}
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Min</Text>
          <TextInput
            style={styles.inputBox}
            keyboardType="numeric"
            value={minInput}
            onChangeText={handleMinInputChange}
            onBlur={handleMinBlur}
            placeholder="0"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.separator}>—</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Max</Text>
          <TextInput
            style={styles.inputBox}
            keyboardType="numeric"
            value={maxInput}
            onChangeText={handleMaxInputChange}
            onBlur={handleMaxBlur}
            placeholder="50"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Slider */}
      <View style={styles.sliderWrapper}>
        {/* Track background (unselected) */}
        <View style={styles.trackBackground} />
        
        {/* Unselected track left of min */}
        <View
          style={[
            styles.trackUnselected,
            {
              left: SLIDER_PADDING,
              width: minPosition,
            },
          ]}
        />

        {/* Active track (selected range) */}
        <View
          style={[
            styles.trackActive,
            {
              left: minPosition + THUMB_SIZE / 2 + SLIDER_PADDING,
              width: maxPosition - minPosition,
            },
          ]}
        />

        {/* Unselected track right of max */}
        <View
          style={[
            styles.trackUnselected,
            {
              left: maxPosition + THUMB_SIZE / 2 + SLIDER_PADDING,
              width: TRACK_WIDTH - maxPosition - THUMB_SIZE / 2,
            },
          ]}
        />

        {/* Min thumb */}
        <View
          {...minPanResponder.panHandlers}
          style={[
            styles.thumb,
            { left: minPosition + SLIDER_PADDING },
          ]}
        />

        {/* Max thumb */}
        <View
          {...maxPanResponder.panHandlers}
          style={[
            styles.thumb,
            { left: maxPosition + SLIDER_PADDING },
          ]}
        />

        {/* Touchable track area */}
        <View
          style={styles.touchableArea}
          onTouchStart={handleTrackPress}
        />
      </View>
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
    marginBottom: 16,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    alignItems: "flex-start",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 6,
  },
  inputBox: {
    width: "100%",
    height: 40,
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    textAlign: "left",
  },
  separator: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
    marginTop: 24,
    marginHorizontal: 8,
  },
  sliderWrapper: {
    height: 50,
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: SLIDER_PADDING,
  },
  trackBackground: {
    position: "absolute",
    height: 4,
    width: TRACK_WIDTH,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
    left: SLIDER_PADDING,
  },
  trackActive: {
    position: "absolute",
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
  },
  trackUnselected: {
    position: "absolute",
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#666",
    top: "50%",
    marginTop: -THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 2,
  },
  touchableArea: {
    position: "absolute",
    width: TRACK_WIDTH,
    height: 50,
    left: SLIDER_PADDING,
    top: 0,
  },
});
