import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSavedRecipes, saveRecipe, deleteRecipe } from '../services/recipeService';

// Mock ingredients for demo
const MOCK_INGREDIENTS = [
  '1 block extra-firm tofu',
  '2 tbsp soy sauce',
  '1 tbsp chili paste',
  '1 tbsp sesame oil',
  '3 cloves garlic (minced)',
  '1 bell pepper (sliced)',
  '1 small broccoli head (cut into florets)',
  '1 tbsp cornstarch',
  '1 tsp sugar',
  '2 tbsp neutral oil (for frying)',
];

const MOCK_INSTRUCTIONS = [
  {step: 1, text: 'Drain & press tofu for 10 minutes, then cut into cubes.'},
  {step: 2, text: 'Toss tofu in cornstarch until evenly coated.'},
  {step: 3, text: 'Heat oil in a pan and fry tofu until golden on all sides; set aside.'},
  {step: 4, text: 'In the same pan, add garlic, chili paste, soy sauce, sesame oil, and sugar, and stir for 30 seconds.'},
  {step: 5, text: 'Add broccoli and bell pepper; stir-fry for 3-5 minutes.'},
  {step: 6, text: 'Add tofu back in and toss everything in the sauce.'},
  {step: 7, text: 'Serve hot with rice or noodles.'},
];

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe, pricing } = route.params;
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use actual recipe data or fall back to mock
  const ingredients = recipe.ingredients || MOCK_INGREDIENTS.map(ing => ({ item: ing, amount: '' }));
  const instructions = recipe.instructions || MOCK_INSTRUCTIONS.map(inst => inst.text);

  // Check if recipe is already saved on mount
  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    try {
      const response = await getSavedRecipes();
      const saved = response.recipes?.find(r => r.name === recipe.name);
      if (saved) {
        setIsSaved(true);
        setSavedRecipeId(saved._id);
      }
    } catch (error) {
      console.error('Error checking if recipe is saved:', error);
    }
  };

  const toggleIngredient = (index) => {
    if (checkedIngredients.includes(index)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== index));
    } else {
      setCheckedIngredients([...checkedIngredients, index]);
    }
  };

  const handleToggleSave = async () => {
    if (loading) return;

    if (isSaved && savedRecipeId) {
      // Delete recipe
      const confirmDelete = () => {
        return new Promise((resolve) => {
          if (Platform.OS === 'web') {
            resolve(window.confirm('Remove this recipe from your saved collection?'));
          } else {
            Alert.alert(
              'Remove Recipe',
              'Remove this recipe from your saved collection?',
              [
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Remove', style: 'destructive', onPress: () => resolve(true) },
              ]
            );
          }
        });
      };

      const confirmed = await confirmDelete();
      if (!confirmed) return;

      try {
        setLoading(true);
        await deleteRecipe(savedRecipeId);
        setIsSaved(false);
        setSavedRecipeId(null);
      } catch (error) {
        console.error('Error deleting recipe:', error);
        if (Platform.OS === 'web') {
          window.alert('Failed to remove recipe');
        } else {
          Alert.alert('Error', 'Failed to remove recipe');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Save recipe
      try {
        setLoading(true);
        const response = await saveRecipe({
          name: recipe.name,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          tips: recipe.tips || [],
          pricing: {
            ingredients: pricing?.ingredients || [],
            totalCost: pricing?.totalCost || 0,
            costPerServing: pricing?.costPerServing || 0,
          },
          prepTime: recipe.prepTime || '15 minutes',
          difficulty: recipe.difficulty || 2,
          budget: recipe.budget || `$${pricing?.totalCost?.toFixed(2) || '0'}`,
          tags: recipe.tags || [],
          isPublic: false,
          isCooked: false,
          likes: recipe.likes || 0,
          comments: recipe.comments || 0,
          description: recipe.description || recipe.instructions?.[0] || '',
        });
        setIsSaved(true);
        setSavedRecipeId(response.recipe._id);

        if (Platform.OS === 'web') {
          window.alert('Recipe saved to your collection!');
        } else {
          Alert.alert('Saved!', 'Recipe saved to your collection!');
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
        if (Platform.OS === 'web') {
          window.alert('Failed to save recipe');
        } else {
          Alert.alert('Error', 'Failed to save recipe');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Recipe Details</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={handleToggleSave}
            disabled={loading}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={isSaved ? "#ff0000" : "#000"}
            />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Image Carousel Placeholder */}
        <View style={styles.imageCarousel}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#ddd" />
          </View>
          {/* Carousel dots */}
          <View style={styles.carouselDots}>
            {[1,2,3,4].map((dot, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
            <Pressable>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </Pressable>
          </View>
        </View>

        {/* Recipe Title & Info */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeTitle}>{recipe?.name || 'Spicy Garlic Tofu Stir-Fry'}</Text>
          <View style={styles.likeRow}>
            <Ionicons name="thumbs-up" size={16} color="#666" />
            <Text style={styles.likeCount}>34</Text>
          </View>
        </View>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>Prep Time: 25 minutes</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.metaText}>Difficulty: ★★★☆☆</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.metaText}>Created by mayayeday</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.metaText}>Budget: $5-10</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          A quick plant-based stir-fry featuring crispy tofu, garlic, and a spicy soy glaze, perfect for busy weeknights.
        </Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          {['Mexican', 'Halal', 'High Protein'].map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <Pressable
              key={index}
              style={styles.ingredientRow}
              onPress={() => toggleIngredient(index)}
            >
              <View style={[
                styles.checkbox,
                checkedIngredients.includes(index) && styles.checkboxChecked
              ]}>
                {checkedIngredients.includes(index) && (
                  <Ionicons name="checkmark" size={14} color="#000" />
                )}
              </View>
              <Text style={[
                styles.ingredientText,
                checkedIngredients.includes(index) && styles.ingredientTextChecked
              ]}>
                {typeof ingredient === 'string' ? ingredient : `${ingredient.amount} ${ingredient.item}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Store Location */}
        <View style={styles.storeSection}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={40} color="#999" />
            <Text style={styles.mapText}>Map placeholder</Text>
          </View>
          <View style={styles.storeInfo}>
            <View style={styles.storeRow}>
              <Ionicons name="location" size={16} color="#666" />
              <View style={styles.storeDetails}>
                <Text style={styles.storeName}>99 Ranch Market</Text>
                <Text style={styles.storeAddress}>1360 Westwood Blvd</Text>
                <Text style={styles.storeAddress}>Los Angeles, CA 90024</Text>
                <Text style={styles.storeSubtext}>All ingredients</Text>
              </View>
              <Text style={styles.storeDistance}>1.2 mi</Text>
            </View>
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <Text style={styles.stepNumber}>Step {index + 1} /{instructions.length}</Text>
              <Text style={styles.instructionText}>{typeof instruction === 'string' ? instruction : instruction.text}</Text>
            </View>
          ))}
        </View>

        {/* Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <View style={styles.allergyRow}>
            {['Vegan', 'Low-Carbon-Footprint', 'Contains Soybeans', 'Contains Sesame'].map((allergy, index) => (
              <View key={index} style={styles.allergyTag}>
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Use tofu or grilled portobello mushrooms for a vegetarian version.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Add cashews for extra crunch.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>For meal prep: store chicken and crema separately, and assemble right before serving to keep tacos from getting soggy.</Text>
          </View>
        </View>

        {/* Personal Note Section */}
        <View style={styles.noteSection}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle}>Personal Note</Text>
            <View style={styles.noteButtons}>
              <Pressable style={styles.noteButton}>
                <Ionicons name="create-outline" size={16} color="#666" />
                <Text style={styles.noteButtonText}>Cooked</Text>
              </Pressable>
              <Pressable style={styles.noteButtonActive}>
                <Ionicons name="checkmark" size={16} color="#666" />
                <Text style={styles.noteButtonText}>Uncooked</Text>
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.noteInput}>
            <Ionicons name="create-outline" size={16} color="#999" />
            <Text style={styles.notePlaceholder}>Add your own tips or insights about this recipe</Text>
          </Pressable>
        </View>

        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  dotActive: {
    backgroundColor: '#666',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  description: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  storeSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  storeInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 13,
    color: '#666',
  },
  storeSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  storeDistance: {
    fontSize: 13,
    color: '#666',
  },
  instructionRow: {
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  allergyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  allergyText: {
    fontSize: 12,
    color: '#666',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  noteSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  noteButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noteButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  noteButtonText: {
    fontSize: 12,
    color: '#666',
  },
  noteInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  notePlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
});
