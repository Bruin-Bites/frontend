import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTagColors, isDietaryRestriction } from "../utils/tagHelpers";
import { likeRecipe, unlikeRecipe, getUserSavedRecipes, markRecipeAsCooked, updatePersonalNote, getRecipeById } from "../services/recipeService";
import { useFocusEffect } from '@react-navigation/native';

// Import custom icons
const clockIcon = require("../../assets/clock.png");
const difficultyIcon = require("../../assets/difficulty-meter.png");
const userIcon = require("../../assets/user-icon.png");
const dollarIcon = require("../../assets/dollar-sign.png");
const locationIcon = require("../../assets/location.png");

// Import allergy icons
const veganIcon = require("../../assets/vegan.png");
const vegetarianIcon = require("../../assets/vegetarian.png");
const lowCarbonIcon = require("../../assets/low-carbon-footprint.png");
const soybeansIcon = require("../../assets/soybeans.png"); // unused
const sesameIcon = require("../../assets/seasame.png"); // unused
const halalIcon = require("../../assets/halal.png");
const eggsIcon = require("../../assets/eggs.png");
const glutenIcon = require("../../assets/gluten.png");
const dairyIcon = require("../../assets/dairy.png");

// Predefined allergies/dietary restriction options
const DIETARY_RESTRICTION_ICONS = {
  "Vegan": veganIcon,
  "Vegetarian": vegetarianIcon,
  "Low-Carbon Footprint": lowCarbonIcon,
  "Gluten-Free": glutenIcon,
  "Dairy-Free": dairyIcon,
  "Keto": vegetarianIcon, // Placeholder - need icon
  "Paleo": vegetarianIcon, // Placeholder - need icon
  "Halal": halalIcon,
  "Kosher": vegetarianIcon, // Placeholder - need icon
  "Nut-Free": vegetarianIcon, // Placeholder - need icon
  "Egg-Free": eggsIcon,
};

export default function RecipeDetailScreen({ route, navigation }) {
  // Add safety checks
  if (!route?.params?.recipe) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Recipe not found</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ padding: 10, backgroundColor: '#A8B84C', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { isPrivate = false } = route.params;
  const [recipe, setRecipe] = useState(route.params.recipe);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [personalNote, setPersonalNote] = useState(recipe.personalNote || "");
  const [isCooked, setIsCooked] = useState(recipe.isCooked || false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Check if recipe is liked on mount
  useEffect(() => {
    checkIfLiked();
  }, [recipe._id]);

  // Refresh recipe data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (recipe?._id) {
        loadRecipeData();
      }
    }, [recipe._id])
  );

  const loadRecipeData = async () => {
    if (!recipe?._id) {
      console.log('No recipe ID available');
      return;
    }

    try {
      const updatedRecipe = await getRecipeById(recipe._id);
      setRecipe(updatedRecipe.recipe);
      setIngredients(updatedRecipe.recipe.ingredients || []);
      checkIfLiked();
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const savedRecipesResponse = await getUserSavedRecipes();
      const savedRecipes = savedRecipesResponse.recipes || [];
      const savedRecipe = savedRecipes.find(r => r._id?.toString() === recipe._id?.toString());

      setLiked(!!savedRecipe);
      if (savedRecipe) {
        setIsCooked(savedRecipe?.isCooked || false);
        setPersonalNote(savedRecipe?.personalNote || "");
      }
    } catch (error) {
      console.error('Error checking if recipe is liked:', error);
    }
  };

  // Get dietary restrictions from tags - add safety check
  const dietaryRestrictions = (recipe.tags || []).filter(tag => isDietaryRestriction(tag));

  const handleLike = async () => {
    if (likeLoading || !recipe._id) return;

    try {
      setLikeLoading(true);

      if (liked) {
        await unlikeRecipe(recipe._id);
        setLiked(false);
      } else {
        await likeRecipe(recipe._id);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to toggle like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCookedToggle = async () => {
    if (!liked || !recipe._id) return; // Only allow if recipe is liked


    try {
      const newCookedStatus = !isCooked;
      await markRecipeAsCooked(recipe._id, newCookedStatus);
      setIsCooked(newCookedStatus);
    } catch (error) {
      console.error('Error updating cooked status:', error);
      Alert.alert('Error', 'Failed to update cooked status.');
    }
  };

  const handleSavePersonalNote = async () => {
    if (!liked || !recipe._id) return; // Only allow if recipe is liked

    try {
      await updatePersonalNote(recipe._id, personalNote);
      Alert.alert('Success', 'Personal note saved!');
    } catch (error) {
      console.error('Error saving personal note:', error);
      Alert.alert('Error', 'Failed to save personal note.');
    }
  };

  const handlePublish = () => {
    Alert.alert(
      "Publish Recipe",
      "Are you sure you want to publish this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Publish", onPress: () => console.log("Recipe published!") },
      ]
    );
  };

  const toggleIngredient = (groupIndex, itemIndex) => {
    const updated = [...ingredients];
    // Check if ingredients are grouped (have 'items' array) or flat
    if (updated[groupIndex].items) {
      // Grouped ingredients
      updated[groupIndex].items[itemIndex].checked = !updated[groupIndex].items[itemIndex].checked;
    } else {
      // Flat ingredients
      updated[groupIndex].checked = !updated[groupIndex].checked;
    }
    setIngredients(updated);
  };

  // Check if ingredients are grouped or flat
  const isGroupedIngredients = ingredients.length > 0 && ingredients[0].items !== undefined;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={`full-${i}`} style={styles.star}>★</Text>);
    }
    if (hasHalfStar) {
      stars.push(<Text key="half" style={styles.star}>★</Text>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Text key={`empty-${i}`} style={styles.starEmpty}>★</Text>);
    }
    return stars;
  };

  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
  };

  const handleEdit = () => {
    setShowActionMenu(false);
    navigation.navigate("RecipeEdit", { recipe });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={isPrivate ? styles.scrollContentWithFooter : styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image || 'https://placehold.co/400x300/cccccc/333333?text=Recipe' }}
            style={styles.image}
          />

          {/* Back Button */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>

          {/* Action Buttons */}
          <View style={styles.headerActions}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#000" />
            </Pressable>
            <Pressable onPress={handleLike} style={styles.actionButton} disabled={likeLoading}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#EF4444" : "#000"}
              />
            </Pressable>
            <Pressable style={styles.actionButton} onPress={toggleActionMenu}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
            </Pressable>

            {/* Action Menu Dropdown */}
            {showActionMenu && (
              <View style={styles.actionMenu}>
                <Pressable style={styles.actionMenuItem} onPress={handleEdit}>
                  <Ionicons name="create-outline" size={18} color="#100C08" />
                  <Text style={styles.actionMenuText}>Edit</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Image Gallery Indicators */}
          <View style={styles.imageIndicators}>
            {[1, 2, 3, 4].map((_, i) => (
              <View key={i} style={[styles.indicator, i === 0 && styles.indicatorActive]} />
            ))}
          </View>
        </View>

        {/* Recipe Title and Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{recipe.name || 'Untitled Recipe'}</Text>
            <View style={styles.statusBlurb}>
              <Text style={styles.statusBlurbText}>
                {isPrivate ? "Private" : `${recipe.likeCount || 0} likes`}
              </Text>
            </View>
          </View>

          {/* Stats Row 1 - Prep Time and Difficulty */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image source={clockIcon} style={styles.statIcon} />
              <Text style={styles.statSubheading}>Prep Time: </Text>
              <Text style={styles.statText}>{recipe.prepTime || 'N/A'} minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={difficultyIcon} style={styles.statIcon} />
              <Text style={styles.statSubheading}>Difficulty: </Text>
              <View style={styles.starsContainer}>
                {renderStars(recipe.difficulty || 0)}
              </View>
            </View>
          </View>

          {/* Stats Row 2 - Created By and Budget */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image source={userIcon} style={styles.statIcon} />
              <Text style={styles.statText}>Created by </Text>
              <Pressable onPress={() => console.log("Profile clicked:", recipe.createdBy || "Anonymous")}>
                <Text style={styles.statSubheading}>{recipe.createdBy || "Anonymous"}</Text>
              </Pressable>
            </View>
            <View style={styles.statItem}>
              <Image source={dollarIcon} style={styles.statIcon} />
              <Text style={styles.statSubheading}>Budget: </Text>
              <Text style={styles.statText}>${recipe.budget_min || "0"} - ${recipe.budget_max || "0"}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{recipe.description || ''}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {(recipe.tags || [])
              .filter(tag => !isDietaryRestriction(tag))
              .map((tag, index) => {
                const colors = getTagColors(tag);
                if (!colors) return null;
                return (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border
                      }
                    ]}
                  >
                    <Text style={[styles.tagText, { color: colors.text }]}>
                      {tag}
                    </Text>
                  </View>
                );
              })}
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {isGroupedIngredients ? (
              // Grouped ingredients with subheadings
              ingredients.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.ingredientGroup}>
                  <Text style={styles.ingredientGroupTitle}>{group.title}</Text>
                  {group.items.map((ingredient, itemIndex) => (
                    <Pressable
                      key={itemIndex}
                      onPress={() => toggleIngredient(groupIndex, itemIndex)}
                      style={styles.ingredientItem}
                    >
                      <Ionicons
                        name={ingredient.checked ? "checkbox" : "square-outline"}
                        size={20}
                        color={ingredient.checked ? "#8AB644" : "#D1D5DB"}
                      />
                      <Text style={[styles.ingredientName, ingredient.checked && styles.checkedText]}>
                        {ingredient.amount + ingredient.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ))
            ) : (
              // Flat ingredients (legacy support)
              ingredients.map((ingredient, index) => (
                <Pressable
                  key={index}
                  onPress={() => toggleIngredient(index, null)}
                  style={styles.ingredientItem}
                >
                  <Ionicons
                    name={ingredient.checked ? "checkbox" : "square-outline"}
                    size={20}
                    color={ingredient.checked ? "#8AB644" : "#D1D5DB"}
                  />
                  <Text style={[styles.ingredientAmount, ingredient.checked && styles.checkedText]}>
                    {ingredient.amount}
                  </Text>
                  <Text style={[styles.ingredientName, ingredient.checked && styles.checkedText]}>
                    {ingredient.item || ingredient.name}
                  </Text>
                </Pressable>
              ))
            )}
          </View>

          {/* Location Section */}
          {recipe.location && (
            <View style={styles.section}>
              <View style={styles.locationContainer}>
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map" size={40} color="#D1D5DB" />
                  <Text style={styles.mapText}>Map View</Text>
                </View>

                <View style={styles.locationHeader}>
                  <View style={styles.locationTitleRow}>
                    <Image source={locationIcon} style={styles.locationIcon} />
                    <Text style={styles.locationName}>{recipe.location.name}</Text>
                  </View>
                  <Text style={styles.locationDistance}>{recipe.location.distance}</Text>
                </View>

                <Text style={styles.locationAddress}>{recipe.location.address}</Text>

                {recipe.location.ingredients && (
                  <Text style={styles.locationIngredientsText}>{recipe.location.ingredients}</Text>
                )}
              </View>
            </View>
          )}

          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            {(recipe.instructions || []).map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.stepLabel}>
                  <Text style={styles.stepText}>Step {index + 1}</Text>
                  <Text style={styles.stepNumber}> / {recipe.instructions?.length || 0}</Text>
                </Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Allergies & Dietary Restrictions Section */}
          {dietaryRestrictions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergies & Dietary</Text>
              <View style={styles.allergiesGrid}>
                {dietaryRestrictions.map((restriction, index) => {
                  const icon = DIETARY_RESTRICTION_ICONS[restriction];
                  if (!icon) return null;
                  return (
                    <View
                      key={restriction}
                      style={[
                        styles.allergyOption,
                        index % 2 === 0 && styles.allergyOptionLeft,
                      ]}
                    >
                      <Image source={icon} style={styles.allergyIcon} />
                      <Text style={styles.allergyLabel}>{restriction}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Tips Section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              {recipe.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Personal Notes Section */}
          {liked && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Notes</Text>
                <View style={styles.cookedToggleContainer}>
                  <Pressable
                    onPress={() => handleCookedToggle()}
                    style={[
                      styles.cookedToggleButton,
                      styles.cookedToggleButtonLeft,
                      isCooked && styles.cookedToggleButtonActive
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={"#000"}
                    />
                    <Text style={[
                      styles.cookedToggleText
                    ]}>
                      Cooked
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleCookedToggle()}
                    style={[
                      styles.cookedToggleButton,
                      styles.cookedToggleButtonRight,
                      !isCooked && styles.cookedToggleButtonActive
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={"#000"}
                    />
                    <Text style={[
                      styles.cookedToggleText
                    ]}>
                      Uncooked
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.noteInputContainer}>
                <View style={styles.noteIconContainer}>
                  <Ionicons name="create-outline" size={18} color="#5F6C7B" />
                  {personalNote.trim().length > 0 && (
                    <Pressable onPress={() => handleSavePersonalNote()}>
                      <Ionicons name="checkmark-circle" size={18} color="#8AB644" />
                    </Pressable>
                  )}
                </View>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add your own tips or insights about the recipe"
                  placeholderTextColor="#99A3AD"
                  value={personalNote}
                  onChangeText={setPersonalNote}
                  multiline
                />
              </View>
            </View>
          )}

          {/* More For You Section - Placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More For You</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moreForYouItem}>
                <Image
                  source={{ uri: "https://via.placeholder.com/120" }}
                  style={styles.moreForYouImage}
                />
                <Text style={styles.moreForYouTitle}>Creamy Mushroom Pasta</Text>
                <Text style={styles.moreForYouMeta}>Difficulty: ★★</Text>
              </View>
              <View style={styles.moreForYouItem}>
                <Image
                  source={{ uri: "https://via.placeholder.com/120" }}
                  style={styles.moreForYouImage}
                />
                <Text style={styles.moreForYouTitle}>Avocado Toast with Chili...</Text>
                <Text style={styles.moreForYouMeta}>Difficulty: ★</Text>
              </View>
            </ScrollView>
          </View>

          {/* Comments Section - Only for Public Recipes */}
          {!isPrivate && (
            <View style={styles.section}>
              <View style={styles.commentsHeader}>
                <Text style={styles.sectionTitle}>Comments</Text>
                <Text style={styles.commentCount}>{recipe.commentCount}</Text>
              </View>

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
                <Ionicons name="chatbubble-outline" size={18} color="#5F6C7B" />
                <TextInput
                  style={styles.commentInput}
                  placeholder="Leave your comment"
                  placeholderTextColor="#99A3AD"
                />
              </View>

              {/* Comments List */}
              {recipe.comments?.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <View style={styles.commentActions}>
                    <Pressable style={styles.commentAction}>
                      <Ionicons name="thumbs-up-outline" size={14} color="#5F6C7B" />
                      <Text style={styles.commentActionText}>{comment.likes}</Text>
                    </Pressable>
                    {comment.replies > 0 && (
                      <Pressable style={styles.commentAction}>
                        <Ionicons name="chatbubble-outline" size={14} color="#5F6C7B" />
                        <Text style={styles.commentActionText}>Reply</Text>
                      </Pressable>
                    )}
                    <Pressable style={styles.commentAction}>
                      <Ionicons name="flag-outline" size={14} color="#5F6C7B" />
                      <Text style={styles.commentActionText}>Report</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Footer - Only for Private Recipes */}
      {isPrivate && (
        <View style={styles.footer}>
          <Pressable style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>Publish</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithFooter: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionMenu: {
    position: "absolute",
    top: 44,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionMenuText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "#100C08",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  indicatorActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: "#100C08",
    flex: 1,
    marginRight: 12,
  },
  statusBlurb: {
    backgroundColor: "#E8F0DA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBlurbText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 14,
    textAlign: "center",
    color: "#100C08",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  statSubheading: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  statText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B2430",
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 12,
    color: "#FFB800",
  },
  starEmpty: {
    fontSize: 12,
    color: "#D1D5DB",
  },
  description: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 12,
  },
  ingredientGroup: {
    marginBottom: 16,
  },
  ingredientGroupTitle: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 20,
    color: "#100C08",
    marginBottom: 8,
    marginTop: 4,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  ingredientAmount: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    width: 80,
  },
  ingredientName: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    flex: 1,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#99A3AD",
  },
  instructionItem: {
    marginBottom: 16,
  },
  stepLabel: {
    marginBottom: 4,
  },
  stepText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#1B2430",
  },
  stepNumber: {
    fontFamily: "Geologica-Light",
    fontSize: 14,
    fontWeight: "400",
    color: "#8AB644",
  },
  instructionText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  publishButton: {
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  publishButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 12,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  mapText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
    marginTop: 8,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  locationIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  locationName: {
    fontFamily: "HankenGrotesk-SemiBold",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 12,
    color: "#100C08",
  },
  locationDistance: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  locationAddress: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 8,
  },
  locationIngredientsTag: {
    backgroundColor: "#8AB644",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  locationIngredientsText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 10,
    color: "#8AB644",
  },
  allergiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  allergyOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  allergyOptionLeft: {
    marginRight: "4%",
  },
  allergyIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 8,
  },
  allergyLabel: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    flex: 1,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  tipBullet: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  tipText: {
    fontFamily: "HankenGrotesk-Regular",
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  noteInputContainer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8AB644",
    padding: 12,
  },
  noteInput: {
    fontFamily: "HankenGrotesk-Regular",
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    minHeight: 60,
    textAlignVertical: "top",
    borderColor: "transparent",
    outlineWidth: 0,
  },
  moreForYouItem: {
    width: 140,
    marginRight: 12,
  },
  moreForYouImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  moreForYouTitle: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 4,
  },
  moreForYouMeta: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  commentCount: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#100C08",
  },
  commentInputContainer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 16,
  },
  commentInput: {
    fontFamily: "HankenGrotesk-Regular",
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthor: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  commentTime: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  commentText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
  cookedToggleContainer: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8AB644",
    overflow: "hidden",
  },
  cookedToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    backgroundColor: "#fff",
  },
  cookedToggleButtonLeft: {
    borderTopLeftRadius: 19,
    borderBottomLeftRadius: 19,
  },
  cookedToggleButtonRight: {
    borderTopRightRadius: 19,
    borderBottomRightRadius: 19,
  },
  cookedToggleButtonActive: {
    backgroundColor: "#E8F0DA",
  },
  cookedToggleText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
  },
  noteIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
});
