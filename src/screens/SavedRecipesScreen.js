import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSavedRecipes, updateRecipe, deleteRecipe } from '../services/recipeService';
import { useFocusEffect } from '@react-navigation/native';

export default function SavedRecipesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('recipe');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getSavedRecipes();
      setRecipes(response.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCooked = async (recipe) => {
    try {
      await updateRecipe(recipe._id, { isCooked: !recipe.isCooked });
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error('Error updating recipe:', error);
      Alert.alert('Error', 'Failed to update recipe');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        if (Platform.OS === 'web') {
          resolve(window.confirm('Are you sure you want to delete this recipe?'));
        } else {
          Alert.alert(
            'Delete Recipe',
            'Are you sure you want to delete this recipe?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        }
      });
    };

    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      await deleteRecipe(recipeId);
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting recipe:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to delete recipe');
      } else {
        Alert.alert('Error', 'Failed to delete recipe');
      }
    }
  };

  const publicRecipes = recipes.filter(r => r.isPublic);
  const privateRecipes = recipes.filter(r => !r.isPublic);

  const renderRecipeCard = ({ item }) => {
    const tags = Array.isArray(item?.tags)
      ? item.tags
      : typeof item?.tags === 'string'
      ? [item.tags]
      : [];

    return (
    <Pressable
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      {/* Heart Icon */}
      <Pressable
        style={styles.heartIcon}
        onPress={(e) => {
          e.stopPropagation();
          handleDeleteRecipe(item._id);
        }}
      >
        <Ionicons name="heart" size={20} color="#ff0000" />
      </Pressable>

      {/* Cooked/Uncooked Badge */}
      <Pressable
        style={[styles.badge, item.isCooked ? styles.badgeCooked : styles.badgeUncooked]}
        onPress={(e) => {
          e.stopPropagation();
          handleToggleCooked(item);
        }}
      >
        <Text style={styles.badgeText}>{item.isCooked ? 'Cooked' : 'Uncooked'}</Text>
      </Pressable>

      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={40} color="#ddd" />
      </View>

      {/* Recipe Info */}
      <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.prepTime}>Prep time: {item.prepTime}</Text>

      {/* Difficulty Stars */}
      <View style={styles.difficultyRow}>
        <Text style={styles.difficultyLabel}>Difficulty: </Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.difficulty ? 'star' : 'star-outline'}
            size={12}
            color={star <= item.difficulty ? '#333' : '#ccc'}
          />
        ))}
      </View>

      {/* Tags */}
      <View style={styles.tagRow}>
        {tags.slice(0, 2).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="thumbs-up-outline" size={14} color="#666" />
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={14} color="#666" />
          <Text style={styles.statText}>{item.comments}</Text>
        </View>
      </View>
    </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'events' && styles.tabActive]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
            Events
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'recipe' && styles.tabActive]}
          onPress={() => setActiveTab('recipe')}
        >
          <Text style={[styles.tabText, activeTab === 'recipe' && styles.tabTextActive]}>
            Recipe
          </Text>
          {activeTab === 'recipe' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading recipes...</Text>
          </View>
        ) : recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No saved recipes yet</Text>
            <Text style={styles.emptySubtext}>Try generating a recipe with the AI Recipe Bot!</Text>
          </View>
        ) : (
          <View>
            {/* Public Recipe Section */}
            {publicRecipes.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Public Recipe</Text>
                <View style={styles.recipeGrid}>
                  {publicRecipes.map((recipe) => (
                    <View key={recipe._id} style={styles.gridItem}>
                      {renderRecipeCard({ item: recipe })}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Private Recipe Section */}
            {privateRecipes.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Private Recipe</Text>
                <View style={styles.recipeGrid}>
                  {privateRecipes.map((recipe) => (
                    <View key={recipe._id} style={styles.gridItem}>
                      {renderRecipeCard({ item: recipe })}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // Active tab styling
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeCooked: {
    backgroundColor: '#999',
  },
  badgeUncooked: {
    backgroundColor: '#666',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
  },
  prepTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 4,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
