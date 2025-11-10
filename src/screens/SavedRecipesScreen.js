import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data matching lofi
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'Spicy Garlic Tofu Stir-Fry',
    prepTime: '25 minutes',
    difficulty: 3,
    budget: '$5-10',
    tags: ['Mexican', 'Vegetarian'],
    isCooked: true,
    likes: 34,
    comments: 6,
    description: 'A quick plant-based stir-fry featuring crispy tofu, garlic, and a spicy soy glaze.',
  },
  {
    id: '2',
    name: 'Creamy Mushroom Pasta',
    prepTime: '30 minutes',
    difficulty: 2,
    budget: '$8-12',
    tags: ['Italian', 'Vegetarian', 'Family-Friendly'],
    isCooked: false,
    likes: 26,
    comments: 8,
    description: 'Creamy pasta with mushrooms and herbs.',
  },
  {
    id: '3',
    name: 'Grilled Chicken Tacos with Lime Crema',
    prepTime: '25 minutes',
    difficulty: 3,
    budget: '$8-13',
    tags: ['Mexican', 'High Protein'],
    isCooked: false,
    likes: 42,
    comments: 12,
    description: 'Juicy grilled chicken tucked into warm tortillas.',
  },
  {
    id: '4',
    name: 'Quinoa & Roasted Veggie Bowl',
    prepTime: '20 minutes',
    difficulty: 2,
    budget: '$7-11',
    tags: ['Mediterranean', 'Vegan'],
    isCooked: false,
    likes: 31,
    comments: 5,
    description: 'Healthy grain bowl with roasted vegetables.',
  },
];

export default function SavedRecipesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('recipe');
  const [recipes, setRecipes] = useState(MOCK_RECIPES);

  const publicRecipes = recipes.filter(r => ['1', '2'].includes(r.id));
  const privateRecipes = recipes.filter(r => ['3', '4'].includes(r.id));

  const renderRecipeCard = ({ item }) => (
    <Pressable
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      {/* Heart Icon */}
      <Pressable style={styles.heartIcon} onPress={() => {}}>
        <Ionicons name="heart-outline" size={20} color="#666" />
      </Pressable>

      {/* Cooked/Uncooked Badge */}
      <View style={[styles.badge, item.isCooked ? styles.badgeCooked : styles.badgeUncooked]}>
        <Text style={styles.badgeText}>{item.isCooked ? 'Cooked' : 'Uncooked'}</Text>
      </View>

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
        {item.tags.slice(0, 2).map((tag, index) => (
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
        {/* Public Recipe Section */}
        <Text style={styles.sectionTitle}>Public Recipe</Text>
        <View style={styles.recipeGrid}>
          {publicRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.gridItem}>
              {renderRecipeCard({ item: recipe })}
            </View>
          ))}
        </View>

        {/* Private Recipe Section */}
        <Text style={styles.sectionTitle}>Private Recipe</Text>
        <View style={styles.recipeGrid}>
          {privateRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.gridItem}>
              {renderRecipeCard({ item: recipe })}
            </View>
          ))}
        </View>
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
});
