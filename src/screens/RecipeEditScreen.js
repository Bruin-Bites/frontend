import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RangeSlider from "rn-range-slider";
import { getTagColors, TAG_CATEGORIES } from "../utils/tagHelpers";
import { Picker } from '@react-native-picker/picker';

// Import custom icons
const clockIcon = require("../../assets/clock.png");

export default function RecipeEditScreen({ route, navigation }) {
  const { recipe: initialRecipe } = route.params || {};

  // Initialize state with recipe data
  const [recipeName, setRecipeName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || 15);
  const [showPrepTimeModal, setShowPrepTimeModal] = useState(false);
  const [difficulty, setDifficulty] = useState(initialRecipe?.difficulty || 2);
  const [minBudget, setMinBudget] = useState(initialRecipe?.budget?.min || 0);
  const [maxBudget, setMaxBudget] = useState(initialRecipe?.budget?.max || 20);
  const [tags, setTags] = useState(initialRecipe?.tags || []);
  const [ingredients, setIngredients] = useState(
    initialRecipe?.ingredients?.map(ing => ({
      amount: ing.amount || "",
      item: ing.item || ing.name || ""
    })) || []
  );
  const [suggestedPlaces, setSuggestedPlaces] = useState(
    initialRecipe?.suggestedPlaces || [{ ingredients: "All ingredients", store: "Trader Joe's" }]
  );
  const [instructions, setInstructions] = useState(initialRecipe?.instructions || []);
  const [allergies, setAllergies] = useState(initialRecipe?.allergies || []);
  const [tips, setTips] = useState(initialRecipe?.tips || []);

  const handleSave = () => {
    console.log("Saving recipe...");
    Alert.alert(
      "Recipe Saved",
      "Your changes have been saved successfully.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const handleRemoveItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleAddItem = (list, setList, defaultValue) => {
    setList([...list, defaultValue]);
  };

  const handleUpdateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleUpdateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleUpdateTip = (index, value) => {
    const newTips = [...tips];
    newTips[index] = value;
    setTips(newTips);
  };

  const prepTimeOptions = [
    { value: 0, label: "0 min" },
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: 45, label: "45 min" },
    { value: 60, label: "1:00" },
    { value: 75, label: "1:15" },
    { value: 90, label: "1:30" },
    { value: 105, label: "1:45" },
    { value: 120, label: "2:00" },
    { value: 999, label: "2h+" },
  ];

  const formatPrepTime = (minutes) => {
    if (minutes === 999) return "2h+";
    if (minutes === 0) return "0 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}:00` : `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imageContainer}>
            {initialRecipe?.image ? (
              <Image source={{ uri: initialRecipe.image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={32} color="#fff" />
              <Text style={styles.imageOverlayText}>Add your own image</Text>
            </View>
          </View>
        </View>

        {/* Recipe Name */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.sectionTitle}>Recipe Name</Text>
            <Ionicons name="pencil" size={16} color="#5F6C7B" />
          </View>
          <TextInput
            style={styles.input}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Enter recipe name"
            placeholderTextColor="#99A3AD"
          />
        </View>

        {/* Short Description */}
        <View style={styles.section}>
          <View style={styles.fieldHeader}>
            <Text style={styles.sectionTitle}>Short Description</Text>
            <Ionicons name="pencil" size={16} color="#5F6C7B" />
          </View>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#99A3AD"
            multiline
          />
        </View>

        {/* Prep Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prep Time</Text>
          <View style={styles.prepTimeContainer}>
            <Image source={clockIcon} style={styles.prepTimeIcon} />
            <Picker
              selectedValue={prepTime}
              onValueChange={(itemValue) => setPrepTime(itemValue)}
              style={styles.prepTimePicker}
              dropdownIconColor="#5F6C7B"
            >
              <Picker.Item label="0 min" value={0} />
              <Picker.Item label="15 min" value={15} />
              <Picker.Item label="30 min" value={30} />
              <Picker.Item label="45 min" value={45} />
              <Picker.Item label="1:00" value={60} />
              <Picker.Item label="1:15" value={75} />
              <Picker.Item label="1:30" value={90} />
              <Picker.Item label="1:45" value={105} />
              <Picker.Item label="2:00" value={120} />
              <Picker.Item label="2h+" value={999} />
            </Picker>
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive,
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === level && styles.difficultyTextActive,
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

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

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <Pressable onPress={() => handleRemoveItem(tags, setTags, index)}>
                  <Ionicons name="close" size={16} color="#5F6C7B" />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={styles.addTagButton}
              onPress={() => {
                Alert.prompt("Add Tag", "Enter tag name:", (text) => {
                  if (text) handleAddItem(tags, setTags, text);
                });
              }}
            >
              <Ionicons name="add" size={20} color="#5F6C7B" />
            </Pressable>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ing, index) => (
            <View key={index} style={styles.listItemContainer}>
              <Ionicons name="reorder-three-outline" size={24} color="#5F6C7B" />
              <TextInput
                style={styles.ingredientAmountInput}
                value={ing.amount}
                onChangeText={(text) => handleUpdateIngredient(index, "amount", text)}
                placeholder="2"
                placeholderTextColor="#99A3AD"
              />
              <TextInput
                style={styles.ingredientItemInput}
                value={ing.item}
                onChangeText={(text) => handleUpdateIngredient(index, "item", text)}
                placeholder="Ingredient name"
                placeholderTextColor="#99A3AD"
                multiline
              />
              <Pressable onPress={() => handleRemoveItem(ingredients, setIngredients, index)}>
                <Ionicons name="close" size={24} color="#5F6C7B" />
              </Pressable>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => handleAddItem(ingredients, setIngredients, { amount: "", item: "" })}
          >
            <Ionicons name="add-circle-outline" size={24} color="#8AB644" />
          </Pressable>
        </View>

        {/* Suggested Places to Buy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Places to Buy</Text>
          {suggestedPlaces.map((place, index) => (
            <View key={index} style={styles.placeItemContainer}>
              <TextInput
                style={styles.placeIngredientInput}
                value={place.ingredients}
                editable={false}
                placeholderTextColor="#99A3AD"
              />
              <View style={styles.placeStoreContainer}>
                <Ionicons name="location-sharp" size={16} color="#D9534F" />
                <Text style={styles.placeStoreText}>{place.store}</Text>
              </View>
            </View>
          ))}
          <Pressable style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#8AB644" />
          </Pressable>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {instructions.map((step, index) => (
            <View key={index} style={styles.listItemContainer}>
              <Ionicons name="reorder-three-outline" size={24} color="#5F6C7B" />
              <TextInput
                style={styles.instructionInput}
                value={step}
                onChangeText={(text) => handleUpdateInstruction(index, text)}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor="#99A3AD"
                multiline
              />
              <Pressable onPress={() => handleRemoveItem(instructions, setInstructions, index)}>
                <Ionicons name="close" size={24} color="#5F6C7B" />
              </Pressable>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => handleAddItem(instructions, setInstructions, "")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#8AB644" />
          </Pressable>
        </View>

        {/* Allergies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <View style={styles.tagsContainer}>
            {allergies.map((allergy, index) => (
              <View key={index} style={[styles.tag, styles.allergyTag]}>
                <Text style={[styles.tagText, styles.allergyTagText]}>{allergy}</Text>
                <Pressable onPress={() => handleRemoveItem(allergies, setAllergies, index)}>
                  <Ionicons name="close" size={16} color="#255633" />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={styles.addTagButton}
              onPress={() => {
                Alert.prompt("Add Allergy", "Enter allergy:", (text) => {
                  if (text) handleAddItem(allergies, setAllergies, text);
                });
              }}
            >
              <Ionicons name="add" size={20} color="#5F6C7B" />
            </Pressable>
          </View>
        </View>

        {/* Tips or Substitutions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips or Substitutions</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.listItemContainer}>
              <Ionicons name="reorder-three-outline" size={24} color="#5F6C7B" />
              <TextInput
                style={styles.instructionInput}
                value={tip}
                onChangeText={(text) => handleUpdateTip(index, text)}
                placeholder="Enter tip"
                placeholderTextColor="#99A3AD"
                multiline
              />
              <Pressable onPress={() => handleRemoveItem(tips, setTips, index)}>
                <Ionicons name="close" size={24} color="#5F6C7B" />
              </Pressable>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => handleAddItem(tips, setTips, "")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#8AB644" />
          </Pressable>
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#100C08",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#100C08",
    marginBottom: 12,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  imageContainer: {
    height: 150,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlayText: {
    color: "#fff",
    marginTop: 8,
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
  },
  prepTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  prepTimeIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  prepTimeText: {
    flex: 1,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  difficultyContainer: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#8AB644",
    borderRadius: 8,
    overflow: "hidden",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
  },
  difficultyButtonActive: {
    backgroundColor: "#8AB644",
  },
  difficultyText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#8AB644",
  },
  difficultyTextActive: {
    color: "#fff",
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
  },
  rail: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  railSelected: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8AB644",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#100C08",
  },
  allergyTag: {
    backgroundColor: "#E8F0DA",
    borderColor: "#8AB644",
    borderWidth: 1,
  },
  allergyTagText: {
    color: "#255633",
  },
  addTagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  ingredientAmountInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 8,
    width: 50,
    textAlign: "center",
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#100C08",
  },
  ingredientItemInput: {
    flex: 1,
    padding: 8,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#100C08",
  },
  instructionInput: {
    flex: 1,
    padding: 8,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  addButton: {
    alignSelf: "center",
    marginTop: 8,
  },
  placeItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  placeIngredientInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#100C08",
  },
  placeStoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: "100%",
  },
  placeStoreText: {
    color: "#D9534F",
    fontFamily: "HankenGrotesk-SemiBold",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
  prepTimePicker: {
    flex: 1,
    marginLeft: -8,
  },
});