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
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MIN_DISTANCE = 0;
const MAX_DISTANCE = 5;
const DISTANCE_STEP = 0.1;
const CONTAINER_PADDING = 22;
const SLIDER_PADDING = 24;
const TRACK_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2 - SLIDER_PADDING * 2;
const THUMB_SIZE = 20;

const BRAND_GREEN = "#8AB644";
const BORDER_GRAY = "#d1d1d1";
const CHECKBOX_BORDER = "#797979";
const TRACK_GRAY = "#d9d9d9";

// Price/Budget range
const MIN_PRICE = 1;
const MAX_PRICE = 4;
const priceOptions = ["$", "$$", "$$$", "$$$$"];

const dateOptions = ["Any Date", "Today", "Tomorrow", "This Week", "This Weekend"];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Avoid alcohol",
  "Low carbon footprint",
  "High carbon footprint",
  "Avoid peanuts",
  "Avoid tree nuts",
  "Avoid wheat",
  "Avoid gluten",
  "Avoid soybeans",
  "Avoid sesame",
  "Avoid dairy",
  "Avoid eggs",
  "Avoid crustacean shellfish",
  "Avoid fish",
];

const dealOptions = [
  "Buy one get one free (BOGO)",
  "First come first serve (FCFS)",
  "Free item",
  "% off discount",
  "Student discount",
  "Combo deal",
  "Rewards/points bonus",
  "Coupon"
];

const foodTypes = [
  "Fast food",
  "Coffee & drinks",
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
  "Delivery only",
  "Dine-in",
  "Takeout",
  "Pop-up",
];

const cuisineTypes = [
  "American",
  "Asian",
  "Mexican",
  "Italian",
  "Mediterranean",
  "Japanese",
  "Korean",
  "Chinese",
  "Indian",
  "Fusion",
];

const timingOptions = [
  "Happy hour",
  "Limited special",
  "Seasonal/holiday",
];

export default function Filter({ 
  filters,
  activeFilters,
  onUpdateFilters,
  onClose, 
  onApply,
  onReset 
}) {
  // Deep clone activeFilters - manually clone to avoid circular reference issues
  const oldFilters = {
    price: Array.isArray(activeFilters?.price) ? [...activeFilters.price] : [],
    distance: activeFilters?.distance 
      ? { min: activeFilters.distance.min, max: activeFilters.distance.max }
      : { min: 0, max: 5 },
    dietary: Array.isArray(activeFilters?.dietary) ? [...activeFilters.dietary] : [],
    deals: Array.isArray(activeFilters?.deals) ? [...activeFilters.deals] : [],
    foodType: Array.isArray(activeFilters?.foodType) ? [...activeFilters.foodType] : [],
    location: Array.isArray(activeFilters?.location) ? [...activeFilters.location] : [],
    cuisineType: Array.isArray(activeFilters?.cuisineType) ? [...activeFilters.cuisineType] : [],
    timing: Array.isArray(activeFilters?.timing) ? [...activeFilters.timing] : [],
    date: activeFilters?.date || null,
    favoritesOnly: activeFilters?.favoritesOnly || false,
  };

  // Budget/Price state - derive from activeFilters.price array
  const getPriceRangeFromFilters = () => {
    if (Array.isArray(activeFilters?.price) && activeFilters.price.length > 0) {
      const symbols = activeFilters.price;
      const indices = symbols.map(s => priceOptions.indexOf(s)).filter(i => i >= 0);
      if (indices.length > 0) {
        return {
          min: Math.min(...indices) + 1,
          max: Math.max(...indices) + 1,
        };
      }
    }
    // Default to full range: $ to $$$$
    return { min: MIN_PRICE, max: MAX_PRICE };
  };

  const initialPriceRange = getPriceRangeFromFilters();
  const [minPrice, setMinPrice] = useState(initialPriceRange.min);
  const [maxPrice, setMaxPrice] = useState(initialPriceRange.max);
  const [activePriceThumb, setActivePriceThumb] = useState(null);
  const [minPriceInput, setMinPriceInput] = useState(
    priceOptions[initialPriceRange.min - 1] || "$"
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    priceOptions[initialPriceRange.max - 1] || "$$$$"
  );
  const [minPriceFocused, setMinPriceFocused] = useState(false);
  const [maxPriceFocused, setMaxPriceFocused] = useState(false);

  // Sync price when activeFilters change
  useEffect(() => {
    const range = getPriceRangeFromFilters();
    setMinPrice(range.min);
    setMaxPrice(range.max);
    if (!minPriceFocused) {
      setMinPriceInput(priceOptions[range.min - 1] || "$");
    }
    if (!maxPriceFocused) {
      setMaxPriceInput(priceOptions[range.max - 1] || "$$$$");
    }
  }, [activeFilters?.price, minPriceFocused, maxPriceFocused]);

  // Sync price inputs when slider values change (but not when input is being edited)
  useEffect(() => {
    if (!minPriceFocused) {
      setMinPriceInput(priceOptions[minPrice - 1] || "$");
    }
  }, [minPrice, minPriceFocused]);

  useEffect(() => {
    if (!maxPriceFocused) {
      setMaxPriceInput(priceOptions[maxPrice - 1] || "$$$$");
    }
  }, [maxPrice, maxPriceFocused]);

  // Distance state
  const [minDistance, setMinDistance] = useState(
    activeFilters?.distance?.min ?? 0
  );
  const [maxDistance, setMaxDistance] = useState(
    activeFilters?.distance?.max ?? 5
  );
  const [activeThumb, setActiveThumb] = useState(null);
  const [minDistanceInput, setMinDistanceInput] = useState(
    (activeFilters?.distance?.min ?? 0).toFixed(1)
  );
  const [maxDistanceInput, setMaxDistanceInput] = useState(
    (activeFilters?.distance?.max ?? 5).toFixed(1)
  );
  const [minDistanceFocused, setMinDistanceFocused] = useState(false);
  const [maxDistanceFocused, setMaxDistanceFocused] = useState(false);

  // Other filter states
  const [selectedDeals, setSelectedDeals] = useState(
    Array.isArray(activeFilters?.deals) ? activeFilters.deals : []
  );
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(
    Array.isArray(activeFilters?.foodType) ? activeFilters.foodType : []
  );
  const [selectedLocationTypes, setSelectedLocationTypes] = useState(
    Array.isArray(activeFilters?.location) ? activeFilters.location : []
  );
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState(
    Array.isArray(activeFilters?.cuisineType) ? activeFilters.cuisineType : []
  );
  const [selectedTiming, setSelectedTiming] = useState(
    Array.isArray(activeFilters?.timing) ? activeFilters.timing : []
  );
  const [selectedDietary, setSelectedDietary] = useState(
    Array.isArray(activeFilters?.dietary) ? activeFilters.dietary : []
  );
  const [selectedDate, setSelectedDate] = useState(
    activeFilters?.date || null
  );

  // Sync distance inputs
  useEffect(() => {
    if (!minDistanceFocused) {
      setMinDistanceInput(minDistance.toFixed(1));
    }
  }, [minDistance, minDistanceFocused]);

  useEffect(() => {
    if (!maxDistanceFocused) {
      setMaxDistanceInput(maxDistance.toFixed(1));
    }
  }, [maxDistance, maxDistanceFocused]);

  // Distance slider helpers
  const getPositionFromValue = (value) => {
    return ((value - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * (TRACK_WIDTH - THUMB_SIZE);
  };

  const getValueFromPosition = (position) => {
    const rawValue = (position / (TRACK_WIDTH - THUMB_SIZE)) * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE;
    const steppedValue = Math.round(rawValue / DISTANCE_STEP) * DISTANCE_STEP;
    return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, steppedValue));
  };

  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setActiveThumb("min"),
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPositionFromValue(minDistance) + gestureState.dx;
      const newValue = getValueFromPosition(newPosition);
      const clampedValue = Math.min(newValue, maxDistance - DISTANCE_STEP);
      if (clampedValue >= MIN_DISTANCE && clampedValue < maxDistance) {
        setMinDistance(clampedValue);
        updateDistanceFilter(clampedValue, maxDistance);
      }
    },
    onPanResponderRelease: () => setActiveThumb(null),
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setActiveThumb("max"),
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPositionFromValue(maxDistance) + gestureState.dx;
      const newValue = getValueFromPosition(newPosition);
      const clampedValue = Math.max(newValue, minDistance + DISTANCE_STEP);
      if (clampedValue <= MAX_DISTANCE && clampedValue > minDistance) {
        setMaxDistance(clampedValue);
        updateDistanceFilter(minDistance, clampedValue);
      }
    },
    onPanResponderRelease: () => setActiveThumb(null),
  });

  const updateDistanceFilter = (min, max) => {
    if (typeof onUpdateFilters === "function") {
      onUpdateFilters({ ...activeFilters, distance: { min, max } });
    }
  };

  const updatePriceFilter = (min, max) => {
    if (typeof onUpdateFilters === "function") {
      // Convert price level to price symbols array
      const priceSymbols = [];
      for (let i = min; i <= max; i++) {
        priceSymbols.push(priceOptions[i - 1]);
      }
      onUpdateFilters({ ...activeFilters, price: priceSymbols });
    }
  };

  // Price slider helpers
  const getPricePositionFromValue = (value) => {
    return ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * (TRACK_WIDTH - THUMB_SIZE);
  };

  const getPriceValueFromPosition = (position) => {
    const rawValue = (position / (TRACK_WIDTH - THUMB_SIZE)) * (MAX_PRICE - MIN_PRICE) + MIN_PRICE;
    return Math.max(MIN_PRICE, Math.min(MAX_PRICE, Math.round(rawValue)));
  };

  const minPricePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setActivePriceThumb("min"),
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPricePositionFromValue(minPrice) + gestureState.dx;
      const newValue = getPriceValueFromPosition(newPosition);
      const clampedValue = Math.min(newValue, maxPrice); // Allow min to equal max
      if (clampedValue >= MIN_PRICE && clampedValue <= maxPrice) {
        setMinPrice(clampedValue);
        setMinPriceInput(levelToSymbol(clampedValue));
        updatePriceFilter(clampedValue, maxPrice);
      }
    },
    onPanResponderRelease: () => setActivePriceThumb(null),
  });

  const maxPricePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => setActivePriceThumb("max"),
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = getPricePositionFromValue(maxPrice) + gestureState.dx;
      const newValue = getPriceValueFromPosition(newPosition);
      const clampedValue = Math.max(newValue, minPrice); // Allow max to equal min
      if (clampedValue <= MAX_PRICE && clampedValue >= minPrice) {
        setMaxPrice(clampedValue);
        setMaxPriceInput(levelToSymbol(clampedValue));
        updatePriceFilter(minPrice, clampedValue);
      }
    },
    onPanResponderRelease: () => setActivePriceThumb(null),
  });

  // Convert price symbol to level (1-4)
  const symbolToLevel = (symbol) => {
    const trimmed = symbol.trim();
    const index = priceOptions.indexOf(trimmed);
    return index >= 0 ? index + 1 : MIN_PRICE;
  };

  // Convert level (1-4) to price symbol
  const levelToSymbol = (level) => {
    return priceOptions[level - 1] || "$";
  };

  const handleMinPriceBlur = () => {
    setMinPriceFocused(false);
    const level = symbolToLevel(minPriceInput);
    // Allow min to equal max (can select single price level)
    const clampedLevel = Math.max(MIN_PRICE, Math.min(level, maxPrice));
    setMinPrice(clampedLevel);
    setMinPriceInput(levelToSymbol(clampedLevel));
    updatePriceFilter(clampedLevel, maxPrice);
  };

  const handleMaxPriceBlur = () => {
    setMaxPriceFocused(false);
    const level = symbolToLevel(maxPriceInput);
    // Allow max to equal min (can select single price level)
    const clampedLevel = Math.min(MAX_PRICE, Math.max(level, minPrice));
    setMaxPrice(clampedLevel);
    setMaxPriceInput(levelToSymbol(clampedLevel));
    updatePriceFilter(minPrice, clampedLevel);
  };

  const minPricePosition = getPricePositionFromValue(minPrice);
  const maxPricePosition = getPricePositionFromValue(maxPrice);

  const handleDistanceInputBlur = (isMin) => {
    if (isMin) {
      setMinDistanceFocused(false);
      const num = parseFloat(minDistanceInput);
      if (isNaN(num) || num < MIN_DISTANCE) {
        setMinDistance(MIN_DISTANCE);
        setMinDistanceInput(MIN_DISTANCE.toFixed(1));
        updateDistanceFilter(MIN_DISTANCE, maxDistance);
      } else if (num >= maxDistance) {
        const newMin = Math.max(MIN_DISTANCE, Math.round((maxDistance - DISTANCE_STEP) / DISTANCE_STEP) * DISTANCE_STEP);
        setMinDistance(newMin);
        setMinDistanceInput(newMin.toFixed(1));
        updateDistanceFilter(newMin, maxDistance);
      } else {
        const steppedValue = Math.round(num / DISTANCE_STEP) * DISTANCE_STEP;
        setMinDistance(steppedValue);
        setMinDistanceInput(steppedValue.toFixed(1));
        updateDistanceFilter(steppedValue, maxDistance);
      }
    } else {
      setMaxDistanceFocused(false);
      const num = parseFloat(maxDistanceInput);
      if (isNaN(num) || num > MAX_DISTANCE) {
        setMaxDistance(MAX_DISTANCE);
        setMaxDistanceInput(MAX_DISTANCE.toFixed(1));
        updateDistanceFilter(minDistance, MAX_DISTANCE);
      } else if (num <= minDistance) {
        const newMax = Math.min(MAX_DISTANCE, Math.round((minDistance + DISTANCE_STEP) / DISTANCE_STEP) * DISTANCE_STEP);
        setMaxDistance(newMax);
        setMaxDistanceInput(newMax.toFixed(1));
        updateDistanceFilter(minDistance, newMax);
      } else {
        const steppedValue = Math.round(num / DISTANCE_STEP) * DISTANCE_STEP;
        setMaxDistance(steppedValue);
        setMaxDistanceInput(steppedValue.toFixed(1));
        updateDistanceFilter(minDistance, steppedValue);
      }
    }
  };

  const minPosition = getPositionFromValue(minDistance);
  const maxPosition = getPositionFromValue(maxDistance);

  const renderCheckboxItem = ({ item, isSelected, onToggle }) => (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={onToggle}
    >
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.checkboxText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRadioItem = ({ item, isSelected, onSelect }) => (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={onSelect}
    >
      <View style={styles.radioOuter}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.checkboxText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={24} color="#000000" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Budget Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.priceInputBox}
                value={minPriceInput}
                onChangeText={setMinPriceInput}
                onFocus={() => setMinPriceFocused(true)}
                onBlur={handleMinPriceBlur}
                placeholder="$"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.separatorLine} />
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.priceInputBox}
                value={maxPriceInput}
                onChangeText={setMaxPriceInput}
                onFocus={() => setMaxPriceFocused(true)}
                onBlur={handleMaxPriceBlur}
                placeholder="$$$$"
                placeholderTextColor="#999"
              />
            </View>
          </View>
          <View style={styles.sliderWrapper}>
            <View style={styles.trackBackground} />
            <View
              style={[
                styles.trackUnselected,
                { left: SLIDER_PADDING, width: minPricePosition },
              ]}
            />
            <View
              style={[
                styles.trackActive,
                {
                  left: minPricePosition + THUMB_SIZE / 2 + SLIDER_PADDING,
                  width: maxPricePosition - minPricePosition,
                },
              ]}
            />
            <View
              style={[
                styles.trackUnselected,
                {
                  left: maxPricePosition + THUMB_SIZE / 2 + SLIDER_PADDING,
                  width: TRACK_WIDTH - maxPricePosition - THUMB_SIZE / 2,
                },
              ]}
            />
            <View
              {...minPricePanResponder.panHandlers}
              style={[styles.thumb, { left: minPricePosition + SLIDER_PADDING }]}
            />
            <View
              {...maxPricePanResponder.panHandlers}
              style={[styles.thumb, { left: maxPricePosition + SLIDER_PADDING }]}
            />
          </View>
        </View>

        {/* Distance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.distanceInputBox}
                value={minDistanceInput}
                onChangeText={setMinDistanceInput}
                onFocus={() => setMinDistanceFocused(true)}
                onBlur={() => handleDistanceInputBlur(true)}
                keyboardType="decimal-pad"
                placeholder="0.0"
              />
            </View>
            <View style={styles.separatorLine} />
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.distanceInputBox}
                value={maxDistanceInput}
                onChangeText={setMaxDistanceInput}
                onFocus={() => setMaxDistanceFocused(true)}
                onBlur={() => handleDistanceInputBlur(false)}
                keyboardType="decimal-pad"
                placeholder="5.0"
              />
            </View>
          </View>
          <View style={styles.sliderWrapper}>
            <View style={styles.trackBackground} />
            <View
              style={[
                styles.trackUnselected,
                { left: SLIDER_PADDING, width: minPosition },
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
              style={[styles.thumb, { left: minPosition + SLIDER_PADDING }]}
            />
            <View
              {...maxPanResponder.panHandlers}
              style={[styles.thumb, { left: maxPosition + SLIDER_PADDING }]}
            />
          </View>
        </View>

        {/* Deal Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal Type</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={dealOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedDeals.includes(item),
                onToggle: () => {
                  const next = selectedDeals.includes(item)
                    ? selectedDeals.filter((d) => d !== item)
                    : [...selectedDeals, item];
                  setSelectedDeals(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, deals: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Food Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Type</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={foodTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedFoodTypes.includes(item),
                onToggle: () => {
                  const next = selectedFoodTypes.includes(item)
                    ? selectedFoodTypes.filter((f) => f !== item)
                    : [...selectedFoodTypes, item];
                  setSelectedFoodTypes(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, foodType: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Location Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Type</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={locationTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedLocationTypes.includes(item),
                onToggle: () => {
                  const next = selectedLocationTypes.includes(item)
                    ? selectedLocationTypes.filter((l) => l !== item)
                    : [...selectedLocationTypes, item];
                  setSelectedLocationTypes(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, location: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Cuisine Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisine Type</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={cuisineTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedCuisineTypes.includes(item),
                onToggle: () => {
                  const next = selectedCuisineTypes.includes(item)
                    ? selectedCuisineTypes.filter((c) => c !== item)
                    : [...selectedCuisineTypes, item];
                  setSelectedCuisineTypes(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, cuisineType: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timing</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={timingOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedTiming.includes(item),
                onToggle: () => {
                  const next = selectedTiming.includes(item)
                    ? selectedTiming.filter((t) => t !== item)
                    : [...selectedTiming, item];
                  setSelectedTiming(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, timing: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.checkboxContainer}>
            <FlatList
              data={dietaryOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderCheckboxItem({
                item,
                isSelected: selectedDietary.includes(item),
                onToggle: () => {
                  const next = selectedDietary.includes(item)
                    ? selectedDietary.filter((d) => d !== item)
                    : [...selectedDietary, item];
                  setSelectedDietary(next);
                  if (typeof onUpdateFilters === "function") {
                    onUpdateFilters({ ...activeFilters, dietary: next });
                  }
                },
              })}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <FlatList
            data={dateOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderRadioItem({
              item,
              isSelected: selectedDate === item,
              onSelect: () => {
                const next = selectedDate === item ? null : item;
                setSelectedDate(next);
                if (typeof onUpdateFilters === "function") {
                  onUpdateFilters({ ...activeFilters, date: next });
                }
              },
            })}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={onApply}
          activeOpacity={0.7}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 33,
    paddingVertical: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    paddingHorizontal: CONTAINER_PADDING,
    paddingVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 29,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
    gap: 8,
    flexWrap: "nowrap",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexShrink: 0,
    flexWrap: "nowrap",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    minWidth: 34,
    flexShrink: 0,
  },
  priceInputBox: {
    width: 113,
    height: 30,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexShrink: 0,
  },
  priceInputText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  distanceInputBox: {
    width: 113,
    height: 30,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    flexShrink: 0,
  },
  separatorLine: {
    width: 43,
    height: 1,
    backgroundColor: "#000000",
    flexShrink: 0,
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
    backgroundColor: TRACK_GRAY,
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
    left: SLIDER_PADDING,
  },
  trackActive: {
    position: "absolute",
    height: 4,
    backgroundColor: BRAND_GREEN,
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
  },
  trackUnselected: {
    position: "absolute",
    height: 4,
    backgroundColor: TRACK_GRAY,
    borderRadius: 2,
    top: "50%",
    marginTop: -2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: BRAND_GREEN,
    top: "50%",
    marginTop: -THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 2,
  },
  checkboxContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1.8,
    borderColor: CHECKBOX_BORDER,
    borderRadius: 4.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
  },
  radioOuter: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1.8,
    borderColor: CHECKBOX_BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BRAND_GREEN,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 49,
    paddingVertical: 29,
    gap: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  resetButton: {
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 45,
    paddingVertical: 9,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: BRAND_GREEN,
  },
  applyButton: {
    flex: 1,
    height: 35,
    borderRadius: 30,
    backgroundColor: BRAND_GREEN,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
  },
});
