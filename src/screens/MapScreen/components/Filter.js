import React, { useState, useEffect } from "react";
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet, 
  Pressable, 
  TouchableOpacity, 
  FlatList,
  Dimensions,
  PanResponder,
  TextInput
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MIN_DISTANCE = 0;
const MAX_DISTANCE = 50;
const CONTAINER_PADDING = 16;
const SLIDER_PADDING = 24;
const TRACK_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2 - SLIDER_PADDING * 2;
const THUMB_SIZE = 20;

const dateOptions = ["Tomorrow", "This Week"];
const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
];
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
const locationTypes = [
  "Franchise",
  "Local",
  "On-campus",
  "Delivery Only",
  "Dine-in",
  "Takeout",
  "Pop-up",
];

export default function Filter({ 
  filters,
  activeFilters,
  onUpdateFilters,
  onClose, 
  onApply,
  onReset }) {

  const oldFilters = structuredClone(activeFilters);

  // Price filter state
  const priceSymbols = Array.isArray(filters?.price) && filters.price.length > 0
    ? filters.price
    : ["$", "$$", "$$$", "$$$$"];

  const [selectedSymbols, setSelectedSymbols] = useState(
    Array.isArray(activeFilters?.price) && activeFilters.price.length > 0
      ? activeFilters.price
      : priceSymbols
  );

  // Dietary preferences state
  const [selectedDietary, setSelectedDietary] = useState(
    Array.isArray(activeFilters?.dietary) ? activeFilters.dietary : []
  );

  // Deal types state
  const [selectedDeals, setSelectedDeals] = useState(
    Array.isArray(activeFilters?.deals) ? activeFilters.deals : []
  );

  // Food types state
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(
    Array.isArray(activeFilters?.foodType) ? activeFilters.foodType : []
  );

  // Location types state
  const [selectedLocationTypes, setSelectedLocationTypes] = useState(
    Array.isArray(activeFilters?.location) ? activeFilters.location : []
  );

  // Date filter state
  const [selectedDate, setSelectedDate] = useState(
    activeFilters?.date || null
  );

  // Distance filter state
  const [minDistance, setMinDistance] = useState(
    activeFilters?.distance?.min ?? 1
  );
  const [maxDistance, setMaxDistance] = useState(
    activeFilters?.distance?.max ?? 40
  );
  const [activeThumb, setActiveThumb] = useState(null);
  const [minInput, setMinInput] = useState(
    (activeFilters?.distance?.min ?? 1).toString()
  );
  const [maxInput, setMaxInput] = useState(
    (activeFilters?.distance?.max ?? 40).toString()
  );

  // Sync local state when activeFilters change (e.g., Reset)
  useEffect(() => {
    if (Array.isArray(activeFilters?.price)) {
      setSelectedSymbols(activeFilters.price);
    }
    if (Array.isArray(activeFilters?.dietary)) {
      setSelectedDietary(activeFilters.dietary);
    }
    if (Array.isArray(activeFilters?.deals)) {
      setSelectedDeals(activeFilters.deals);
    }
    if (Array.isArray(activeFilters?.foodType)) {
      setSelectedFoodTypes(activeFilters.foodType);
    }
    if (Array.isArray(activeFilters?.location)) {
      setSelectedLocationTypes(activeFilters.location);
    }
    if (activeFilters?.date !== undefined) {
      setSelectedDate(activeFilters.date || null);
    }
    if (activeFilters?.distance) {
      const min = activeFilters.distance.min ?? 1;
      const max = activeFilters.distance.max ?? 40;
      setMinDistance(min);
      setMaxDistance(max);
      setMinInput(min.toString());
      setMaxInput(max.toString());
    }
  }, [activeFilters]);

  // Sync distance inputs when slider values change
  useEffect(() => {
    setMinInput(minDistance.toString());
  }, [minDistance]);

  useEffect(() => {
    setMaxInput(maxDistance.toString());
  }, [maxDistance]);

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

  // Price filter handlers
  const togglePriceSymbol = (symbol) => {
    const next = selectedSymbols.includes(symbol)
      ? selectedSymbols.filter((s) => s !== symbol)
      : [...selectedSymbols, symbol];
    
    setSelectedSymbols(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, price: next });
    }
  };

  // Dietary preferences handlers
  const toggleDietary = (option) => {
    const next = selectedDietary.includes(option)
      ? selectedDietary.filter((item) => item !== option)
      : [...selectedDietary, option];
    
    setSelectedDietary(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, dietary: next });
    }
  };

  // Deal types handlers
  const toggleDeal = (deal) => {
    const next = selectedDeals.includes(deal)
      ? selectedDeals.filter((item) => item !== deal)
      : [...selectedDeals, deal];
    
    setSelectedDeals(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, deals: next });
    }
  };

  // Food types handlers
  const toggleFoodType = (type) => {
    const next = selectedFoodTypes.includes(type)
      ? selectedFoodTypes.filter((item) => item !== type)
      : [...selectedFoodTypes, type];
    
    setSelectedFoodTypes(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, foodType: next });
    }
  };

  // Location types handlers
  const toggleLocationType = (type) => {
    const next = selectedLocationTypes.includes(type)
      ? selectedLocationTypes.filter((item) => item !== type)
      : [...selectedLocationTypes, type];
    
    setSelectedLocationTypes(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, location: next });
    }
  };

  // Date filter handlers
  const handleDateSelect = (option) => {
    const next = selectedDate === option ? null : option;
    setSelectedDate(next);
    
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, date: next });
    }
  };

  // Distance filter helpers
  const formatDistance = (value) => {
    return value === 1 ? `${value} Mile` : `${value} Miles`;
  };

  const getPositionFromValue = (value) => {
    return ((value - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * (TRACK_WIDTH - THUMB_SIZE);
  };

  const getValueFromPosition = (position) => {
    const value = Math.round((position / (TRACK_WIDTH - THUMB_SIZE)) * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE);
    return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, value));
  };

  const handleMinInputChange = (text) => {
    setMinInput(text);
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      const clampedValue = Math.max(MIN_DISTANCE, Math.min(num, maxDistance - 1));
      setMinDistance(clampedValue);
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: clampedValue, max: maxDistance } });
      }
    }
  };

  const handleMaxInputChange = (text) => {
    setMaxInput(text);
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      const clampedValue = Math.min(MAX_DISTANCE, Math.max(num, minDistance + 1));
      setMaxDistance(clampedValue);
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: clampedValue } });
      }
    }
  };

  const handleMinBlur = () => {
    const num = parseInt(minInput, 10);
    if (isNaN(num) || num < MIN_DISTANCE) {
      setMinDistance(MIN_DISTANCE);
      setMinInput(MIN_DISTANCE.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: MIN_DISTANCE, max: maxDistance } });
      }
    } else if (num >= maxDistance) {
      const newMin = maxDistance - 1;
      setMinDistance(newMin);
      setMinInput(newMin.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: newMin, max: maxDistance } });
      }
    } else {
      setMinDistance(num);
      setMinInput(num.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: num, max: maxDistance } });
      }
    }
  };

  const handleMaxBlur = () => {
    const num = parseInt(maxInput, 10);
    if (isNaN(num) || num > MAX_DISTANCE) {
      setMaxDistance(MAX_DISTANCE);
      setMaxInput(MAX_DISTANCE.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: MAX_DISTANCE } });
      }
    } else if (num <= minDistance) {
      const newMax = minDistance + 1;
      setMaxDistance(newMax);
      setMaxInput(newMax.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: newMax } });
      }
    } else {
      setMaxDistance(num);
      setMaxInput(num.toString());
      if (typeof onUpdateFilters === "function") {
        onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: num } });
      }
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
      if (newValue >= MIN_DISTANCE && newValue < maxDistance) {
        setMinDistance(newValue);
        if (typeof onUpdateFilters === "function") {
          onUpdateFilters({ ...activeFilters, distance: { min: newValue, max: maxDistance } });
        }
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
      if (newValue <= MAX_DISTANCE && newValue > minDistance) {
        setMaxDistance(newValue);
        if (typeof onUpdateFilters === "function") {
          onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: newValue } });
        }
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
        if (typeof onUpdateFilters === "function") {
          onUpdateFilters({ ...activeFilters, distance: { min: newValue, max: maxDistance } });
        }
      }
    } else {
      // Closer to max thumb
      if (newValue > minDistance) {
        setMaxDistance(newValue);
        if (typeof onUpdateFilters === "function") {
          onUpdateFilters({ ...activeFilters, distance: { min: minDistance, max: newValue } });
        }
      }
    }
  };

  const minPosition = getPositionFromValue(minDistance);
  const maxPosition = getPositionFromValue(maxDistance);

  // Render functions
  const renderPriceItem = ({ item }) => {
    const isSelected = selectedSymbols.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => togglePriceSymbol(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderDietaryItem = ({ item }) => {
    const isSelected = selectedDietary.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleDietary(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderDealItem = ({ item }) => {
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

  const renderFoodTypeItem = ({ item }) => {
    const isSelected = selectedFoodTypes.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleFoodType(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderLocationTypeItem = ({ item }) => {
    const isSelected = selectedLocationTypes.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => toggleLocationType(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item;
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleDateSelect(item)}
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
        {/* Price Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Price</Text>
          <FlatList
            data={priceSymbols}
            keyExtractor={(item) => item}
            renderItem={renderPriceItem}
            scrollEnabled={false}
          />
        </View>

        {/* Distance Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Distance</Text>
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
          <View style={styles.sliderWrapper}>
            <View style={styles.trackBackground} />
            <View
              style={[
                styles.trackUnselected,
                {
                  left: SLIDER_PADDING,
                  width: minPosition,
                },
              ]}
            />
            <View
              style={[
                styles.trackActive,
                {
                  left: minPosition + THUMB_SIZE / 2 + SLIDER_PADDING,
                  width: maxPosition - minPosition,
                },
              ]}
            />
            <View
              style={[
                styles.trackUnselected,
                {
                  left: maxPosition + THUMB_SIZE / 2 + SLIDER_PADDING,
                  width: TRACK_WIDTH - maxPosition - THUMB_SIZE / 2,
                },
              ]}
            />
            <View
              {...minPanResponder.panHandlers}
              style={[
                styles.thumb,
                { left: minPosition + SLIDER_PADDING },
              ]}
            />
            <View
              {...maxPanResponder.panHandlers}
              style={[
                styles.thumb,
                { left: maxPosition + SLIDER_PADDING },
              ]}
            />
            <View
              style={styles.touchableArea}
              onTouchStart={handleTrackPress}
            />
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Dietary Preferences</Text>
          <FlatList
            data={dietaryOptions}
            keyExtractor={(item) => item}
            renderItem={renderDietaryItem}
            scrollEnabled={false}
          />
        </View>

        {/* Deal Types */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Deal Type</Text>
          <FlatList
            data={dealOptions}
            keyExtractor={(item) => item}
            renderItem={renderDealItem}
            scrollEnabled={false}
          />
        </View>

        {/* Location Types */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Location Types</Text>
          <FlatList
            data={locationTypes}
            keyExtractor={(item) => item}
            renderItem={renderLocationTypeItem}
            scrollEnabled={false}
          />
        </View>

        {/* Food Types */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Food Types</Text>
          <FlatList
            data={foodTypes}
            keyExtractor={(item) => item}
            renderItem={renderFoodTypeItem}
            scrollEnabled={false}
          />
        </View>

        {/* Date Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Date</Text>
          <FlatList
            data={dateOptions}
            keyExtractor={(item) => item}
            renderItem={renderDateItem}
            scrollEnabled={false}
          />
        </View>
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
  filterSection: {
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
    color: "#333",
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
