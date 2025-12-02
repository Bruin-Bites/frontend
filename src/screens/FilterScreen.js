import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RangeSlider from "rn-range-slider";

// Filter options
const CUISINES = [
    "Italian",
    "American",
    "Asian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "Mediterranean",
    "French",
    "Greek",
    "Korean",
    "Vietnamese",
    "Spanish",
];

const DIETARY_RESTRICTIONS = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Halal",
    "Kosher",
    "Nut-Free",
    "Low-Carbon Footprint",
    "Egg-Free",
];

const DIETARY_INFORMATION = [
    "High Protein",
    "Low Carb",
    "Quick & Easy",
    "One Pot",
    "Meal Prep",
    "Budget Friendly",
    "Comfort Food",
];

const FOOD_TYPES = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Appetizer",
    "Side Dish",
    "Main Course",
    "Beverage",
];

export default function FilterScreen({ navigation, route }) {
  // Get current filters from route params, or use defaults
  const currentFilters = route.params?.currentFilters || {
    minBudget: 0,
    maxBudget: 20,
    minPrepTime: 1,
    maxPrepTime: 120,
    minDifficulty: 1,
    maxDifficulty: 5,
    selectedCuisines: [],
    selectedDietary: [],
    selectedDietaryInfo: [],
    selectedFoodTypes: [],
  };

  // Budget state
  const [minBudget, setMinBudget] = useState(currentFilters.minBudget);
  const [maxBudget, setMaxBudget] = useState(currentFilters.maxBudget);

  // Prep Time state
  const [minPrepTime, setMinPrepTime] = useState(currentFilters.minPrepTime);
  const [maxPrepTime, setMaxPrepTime] = useState(currentFilters.maxPrepTime);

  // Difficulty state (1-5)
  const [minDifficulty, setMinDifficulty] = useState(currentFilters.minDifficulty);
  const [maxDifficulty, setMaxDifficulty] = useState(currentFilters.maxDifficulty);

  // Cuisine state
  const [selectedCuisines, setSelectedCuisines] = useState(currentFilters.selectedCuisines || []);

  // Dietary Restrictions state
  const [selectedDietary, setSelectedDietary] = useState(currentFilters.selectedDietary || []);

  // Dietary Information state
  const [selectedDietaryInfo, setSelectedDietaryInfo] = useState(currentFilters.selectedDietaryInfo || []);

  // Food Type state
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(currentFilters.selectedFoodTypes || []);

  const toggleCuisine = (item) => {
    setSelectedCuisines((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleDietary = (item) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleDietaryInfo = (item) => {
    setSelectedDietaryInfo((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleFoodType = (item) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleReset = () => {
    setMinBudget(0);
    setMaxBudget(20);
    setMinPrepTime(1);
    setMaxPrepTime(120);
    setMinDifficulty(1);
    setMaxDifficulty(5);
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSelectedDietaryInfo([]);
    setSelectedFoodTypes([]);
  };

  const handleApplyFilters = () => {
    // Create filters object
    const filters = {
      minBudget,
      maxBudget,
      minPrepTime,
      maxPrepTime,
      minDifficulty,
      maxDifficulty,
      selectedCuisines,
      selectedDietary,
      selectedDietaryInfo,
      selectedFoodTypes,
    };

    // Navigate back and pass filters
    navigation.navigate("UserRecipes", { filters });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budget Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <View style={styles.rangeInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Min</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>${minBudget}</Text>
              </View>
            </View>
            <View style={styles.rangeSeparator} />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Max</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>${maxBudget}</Text>
              </View>
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <RangeSlider
              style={styles.slider}
              min={0}
              max={20}
              step={1}
              low={minBudget}
              high={maxBudget}
              floatingLabel={false}
              renderThumb={useCallback(() => <View style={styles.thumb} />, [])}
              renderRail={useCallback(() => <View style={styles.rail} />, [])}
              renderRailSelected={useCallback(() => <View style={styles.railSelected} />, [])}
              onValueChanged={useCallback((low, high) => {
                setMinBudget(low);
                setMaxBudget(high);
              }, [])}
            />
          </View>
        </View>

        {/* Prep Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prep Time</Text>
          <View style={styles.rangeInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Min</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{minPrepTime} min</Text>
              </View>
            </View>
            <View style={styles.rangeSeparator} />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Max</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{maxPrepTime} min</Text>
              </View>
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <RangeSlider
              style={styles.slider}
              min={1}
              max={120}
              step={1}
              low={minPrepTime}
              high={maxPrepTime}
              floatingLabel={false}
              renderThumb={useCallback(() => <View style={styles.thumb} />, [])}
              renderRail={useCallback(() => <View style={styles.rail} />, [])}
              renderRailSelected={useCallback(() => <View style={styles.railSelected} />, [])}
              onValueChanged={useCallback((low, high) => {
                setMinPrepTime(low);
                setMaxPrepTime(high);
              }, [])}
            />
          </View>
        </View>

        {/* Difficulty Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <Text style={styles.sectionSubtitle}>
            1 being easiest and 5 being hardest.
          </Text>
          <View style={styles.sliderContainer}>
            <RangeSlider
              style={styles.slider}
              min={1}
              max={5}
              step={1}
              low={minDifficulty}
              high={maxDifficulty}
              floatingLabel={false}
              renderThumb={useCallback(() => <View style={styles.thumb} />, [])}
              renderRail={useCallback(() => <View style={styles.rail} />, [])}
              renderRailSelected={useCallback(() => <View style={styles.railSelected} />, [])}
              onValueChanged={useCallback((low, high) => {
                setMinDifficulty(low);
                setMaxDifficulty(high);
              }, [])}
            />
          </View>
          <View style={styles.difficultyLabels}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Text key={num} style={styles.difficultyLabel}>
                {num}
              </Text>
            ))}
          </View>
        </View>

        {/* Cuisine Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisine Type</Text>
          {CUISINES.map((item) => (
            <Pressable
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleCuisine(item)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedCuisines.includes(item) && styles.checkboxChecked,
                ]}
              >
                {selectedCuisines.includes(item) && (
                  <Ionicons name="checkmark" size={16} color="#8AB644" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Dietary Restrictions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          {DIETARY_RESTRICTIONS.map((item) => (
            <Pressable
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleDietary(item)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedDietary.includes(item) && styles.checkboxChecked,
                ]}
              >
                {selectedDietary.includes(item) && (
                  <Ionicons name="checkmark" size={16} color="#8AB644" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Dietary Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Information</Text>
          {DIETARY_INFORMATION.map((item) => (
            <Pressable
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleDietaryInfo(item)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedDietaryInfo.includes(item) && styles.checkboxChecked,
                ]}
              >
                {selectedDietaryInfo.includes(item) && (
                  <Ionicons name="checkmark" size={16} color="#8AB644" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Food Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Type</Text>
          {FOOD_TYPES.map((item) => (
            <Pressable
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleFoodType(item)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedFoodTypes.includes(item) && styles.checkboxChecked,
                ]}
              >
                {selectedFoodTypes.includes(item) && (
                  <Ionicons name="checkmark" size={16} color="#8AB644" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.applyButton} onPress={handleApplyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: "#100C08",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 12,
  },
  rangeInputs: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  inputText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  rangeSeparator: {
    width: 20,
    height: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 28,
  },
  sliderContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#8AB644",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  railSelected: {
    height: 4,
    backgroundColor: "#8AB644",
    borderRadius: 2,
  },
  difficultyLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  difficultyLabel: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  checkboxLabel: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  resetButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  resetButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#100C08",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
});
