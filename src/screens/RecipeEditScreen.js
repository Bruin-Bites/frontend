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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RangeSlider from "rn-range-slider";
import { getTagColors, TAG_CATEGORIES } from "../utils/tagHelpers";
import { saveRecipe, updateRecipe, getRecipeById } from "../services/recipeService";

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
  const [minBudget, setMinBudget] = useState(initialRecipe?.budget_min || 0);
  const [maxBudget, setMaxBudget] = useState(initialRecipe?.budget_max || 50);
  const [tags, setTags] = useState(initialRecipe?.tags || ["Italian", "Dinner", "Vegetarian"]);
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
  const [showTagModal, setShowTagModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [tips, setTips] = useState(initialRecipe?.tips || []);
  const [loading, setLoading] = useState(false);
  const [recipeId, setRecipeId] = useState(initialRecipe?._id || null);

  const handleSave = async () => {
    console.log("handleSave called");

    // Validation
    if (!recipeName.trim()) {
      console.log("Validation failed: no recipe name");
      Alert.alert("Error", "Please enter a recipe name.");
      return;
    }
    if (ingredients.length === 0) {
      console.log("Validation failed: no ingredients");
      Alert.alert("Error", "Please add at least one ingredient.");
      return;
    }
    if (instructions.length === 0) {
      console.log("Validation failed: no instructions");
      Alert.alert("Error", "Please add at least one instruction.");
      return;
    }

    console.log("Validation passed, attempting to save...");

    try {
      setLoading(true);

      const recipeData = {
        name: recipeName,
        description,
        servings: 4,
        ingredients: ingredients.map(ing => ({
          item: ing.item,
          amount: ing.amount
        })),
        instructions,
        tips,
        image: initialRecipe?.image || "https://placehold.co/400x300/e2e8f0/64748b?text=Recipe+Image",
        prepTime,
        difficulty,
        budget_min: minBudget,
        budget_max: maxBudget,
        tags,
        allergies,
        isPublic: initialRecipe?.isPublic || false,
        rating: initialRecipe?.rating || 0
      };

      console.log("Recipe data:", recipeData);
      console.log("Recipe ID:", recipeId);

      if (recipeId) {
        console.log("Updating existing recipe...");
        const result = await updateRecipe(recipeId, recipeData);
        console.log("Update result:", result);

        // Navigate to RecipeDetail with updated recipe
        navigation.navigate('RecipeDetail', {
          recipe: result.recipe,
          isPrivate: true
        });
      } else {
        console.log("Creating new recipe...");
        const response = await saveRecipe(recipeData);
        console.log("Save response:", response);

        // Navigate to RecipeDetail with new recipe
        navigation.navigate('RecipeDetail', {
          recipe: response.recipe,
          isPrivate: true
        });
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save recipe. Please try again.";
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
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
          <Pressable
            style={styles.prepTimeContainer}
            onPress={() => setShowPrepTimeModal(true)}
          >
            <Image source={clockIcon} style={styles.prepTimeIcon} />
            <Text style={styles.prepTimeText}>{formatPrepTime(prepTime)}</Text>
            <Ionicons name="chevron-down" size={20} color="#5F6C7B" />
          </Pressable>
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
          <View style={styles.budgetInputsRow}>
            <View style={styles.budgetInputGroup}>
              <Text style={styles.budgetLabel}>Min</Text>
              <View style={styles.budgetInput}>
                <Text style={styles.budgetText}>${minBudget}</Text>
              </View>
            </View>
            <View style={styles.budgetSeparator} />
            <View style={styles.budgetInputGroup}>
              <Text style={styles.budgetLabel}>Max</Text>
              <View style={styles.budgetInput}>
                <Text style={styles.budgetText}>${maxBudget}</Text>
              </View>
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <RangeSlider
              style={styles.slider}
              min={0}
              max={50}
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
            {tags.map((tag, index) => {
              const tagColors = getTagColors(tag);
              return (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    tagColors && {
                      backgroundColor: tagColors.background,
                      borderColor: tagColors.border,
                      borderWidth: 1,
                    }
                  ]}
                >
                  <Text style={[
                    styles.tagText,
                    tagColors && { color: tagColors.text }
                  ]}>{tag}</Text>
                  <Pressable onPress={() => handleRemoveItem(tags, setTags, index)}>
                    <Ionicons name="close" size={16} color={tagColors?.text || "#5F6C7B"} />
                  </Pressable>
                </View>
              );
            })}
            <Pressable
              style={styles.addTagButton}
              onPress={() => setShowTagModal(true)}
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
              onPress={() => setShowAllergyModal(true)}
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
        <Pressable
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={() => handleSave()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* Tag Selection Modal */}
      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTagModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTagModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Tag</Text>
              <Pressable onPress={() => setShowTagModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            <ScrollView>
              {Object.entries(TAG_CATEGORIES).map(([category, categoryTags]) => {
                if (category === 'dietaryRestrictions') return null;
                return (
                  <View key={category} style={styles.modalCategory}>
                    <Text style={styles.modalCategoryTitle}>
                      {category === 'foodType' ? 'Food Type' :
                        category === 'cuisineType' ? 'Cuisine' :
                          'Dietary Info'}
                    </Text>
                    <View style={styles.modalTagsContainer}>
                      {categoryTags.map((tag) => {
                        const isSelected = tags.includes(tag);
                        const tagColors = getTagColors(tag);
                        return (
                          <Pressable
                            key={tag}
                            style={[
                              styles.modalTag,
                              isSelected && styles.modalTagSelected,
                              tagColors && {
                                backgroundColor: isSelected ? tagColors.background : '#F3F4F6',
                                borderColor: tagColors.border,
                              }
                            ]}
                            onPress={() => {
                              if (isSelected) {
                                setTags(tags.filter(t => t !== tag));
                              } else {
                                setTags([...tags, tag]);
                              }
                            }}
                          >
                            <Text style={[
                              styles.modalTagText,
                              isSelected && tagColors && { color: tagColors.text }
                            ]}>{tag}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Allergy Selection Modal */}
      <Modal
        visible={showAllergyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAllergyModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowAllergyModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Allergy/Dietary Restriction</Text>
              <Pressable onPress={() => setShowAllergyModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            <ScrollView>
              <View style={styles.modalTagsContainer}>
                {TAG_CATEGORIES.dietaryRestrictions.map((allergy) => {
                  const isSelected = allergies.includes(allergy);
                  return (
                    <Pressable
                      key={allergy}
                      style={[
                        styles.modalTag,
                        isSelected && styles.modalAllergySelected,
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          setAllergies(allergies.filter(a => a !== allergy));
                        } else {
                          setAllergies([...allergies, allergy]);
                        }
                      }}
                    >
                      <Text style={[
                        styles.modalTagText,
                        isSelected && styles.modalAllergyText
                      ]}>{allergy}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Prep Time Selection Modal */}
      <Modal
        visible={showPrepTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrepTimeModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPrepTimeModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Prep Time</Text>
              <Pressable onPress={() => setShowPrepTimeModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            <ScrollView>
              {prepTimeOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.prepTimeOption,
                    prepTime === option.value && styles.prepTimeOptionSelected
                  ]}
                  onPress={() => {
                    setPrepTime(option.value);
                    setShowPrepTimeModal(false);
                  }}
                >
                  <Text style={[
                    styles.prepTimeOptionText,
                    prepTime === option.value && styles.prepTimeOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {prepTime === option.value && (
                    <Ionicons name="checkmark" size={20} color="#8AB644" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    color: "#100C08",
    outlineStyle: "none",
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
  budgetInputsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  budgetInputGroup: {
    flex: 1,
  },
  budgetLabel: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 8,
  },
  budgetInput: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  budgetText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  budgetSeparator: {
    width: 20,
    height: 1,
    backgroundColor: "#D1D5DB",
    alignSelf: "flex-end",
    marginBottom: 20,
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
    alignItems: "center",
  },
  ingredientAmountInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 8,
    width: 150,
    textAlign: "left",
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#100C08",
    outlineStyle: "none",
    alignItems: "center",
  },
  ingredientItemInput: {
    flex: 1,
    padding: 8,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#100C08",
    outlineStyle: "none",
    alignItems: "center",
  },
  instructionInput: {
    flex: 1,
    padding: 8,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    outlineStyle: "none",
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
  saveButtonDisabled: {
    opacity: 0.5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    color: "#100C08",
  },
  modalCategory: {
    marginBottom: 20,
  },
  modalCategoryTitle: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#5F6C7B",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  modalTagSelected: {
    borderWidth: 1.5,
  },
  modalAllergySelected: {
    backgroundColor: "#E8F0DA",
    borderColor: "#8AB644",
    borderWidth: 1.5,
  },
  modalTagText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#100C08",
  },
  modalAllergyText: {
    color: "#255633",
    fontFamily: "HankenGrotesk-SemiBold",
    fontWeight: "600",
  },
  prepTimeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  prepTimeOptionSelected: {
    backgroundColor: "#F0FDF4",
  },
  prepTimeOptionText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "#100C08",
  },
  prepTimeOptionTextSelected: {
    fontFamily: "HankenGrotesk-SemiBold",
    fontWeight: "600",
    color: "#8AB644",
  },
});
