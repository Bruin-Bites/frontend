import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import RecipeDisplay from "../components/RecipeDisplay";
import { getSavedRecipes, getUserSavedRecipes } from "../services/recipeService";
import { useFocusEffect } from "@react-navigation/native";

export default function UserRecipesScreen({ navigation, route }) {
  const [filters, setFilters] = useState({
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
  });

  // State for fetched recipes
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from database on mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  // Also refetch when filters change
  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters);
      fetchRecipes();
    }
  }, [route.params?.filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      // Fetch user's created recipes
      const myRecipesResponse = await getSavedRecipes();
      const fetchedMyRecipes = myRecipesResponse.recipes || [];

      // Fetch user's saved/liked recipes
      const savedRecipesResponse = await getUserSavedRecipes();
      const fetchedSavedRecipes = savedRecipesResponse.recipes || [];

      // Create a Set of saved recipe IDs for quick lookup
      const savedRecipeIds = new Set(
        fetchedSavedRecipes.map(r => r._id?.toString())
      );

      // Mark recipes as liked if they're in saved recipes
      const markAsLiked = (recipes) => {
        return recipes.map(recipe => ({
          ...recipe,
          isLiked: savedRecipeIds.has(recipe._id?.toString())
        }));
      };

      // Set recipes with proper isLiked flags
      setMyRecipes(markAsLiked(fetchedMyRecipes));
      setSavedRecipes(fetchedSavedRecipes.map(r => ({ ...r, isLiked: true })));
      // Trending should not auto-update with user's new recipes
      // Keep trending as is, or set to empty
      // setTrendingRecipes(markAsLiked(fetchedMyRecipes));

    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Keep empty arrays on error
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike from RecipeDisplay component
  const handleLikeChange = async (recipeId, isLiked) => {
    if (isLiked) {
      // Recipe was just liked, refresh to show it in saved recipes
      await fetchRecipes();
    } else {
      // Recipe was unliked, remove from ALL sections at once
      // Use string comparison to ensure matching
      const recipeIdStr = recipeId?.toString();
      setSavedRecipes(prev => prev.filter(r => r._id?.toString() !== recipeIdStr));
      setMyRecipes(prev => prev.filter(r => r._id?.toString() !== recipeIdStr));
      setTrendingRecipes(prev => prev.filter(r => r._id?.toString() !== recipeIdStr));
    }
  };

  // Listen for filter updates from FilterScreen
  useEffect(() => {
    if (route.params?.filters) {
      setFilters(route.params.filters);
      console.log("Updated filters:", route.params.filters);
    }
  }, [route.params?.filters]);

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipe, isPrivate: recipe.isPrivate });
  };

  const handleChatPress = () => {
    console.log("Chat pressed");
    navigation.navigate("Chat");
  };

  const handleFilterPress = () => {
    navigation.navigate("Filter", { currentFilters: filters });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Filter */}
      <View style={styles.searchContainer}>
        <Pressable
          style={styles.searchBar}
          onPress={() => navigation.navigate("RecipeSearch")}
        >
          <Ionicons name="search" size={22} color="#000000" />
          <Text style={styles.searchPlaceholder}>Find recipe</Text>
          <Pressable
            onPress={handleFilterPress}
            style={styles.filterButton}
          >
            <Ionicons name="options" size={24} color="#000000" />
          </Pressable>
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Recipe Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Recipe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeRow}
          >
            {!loading && trendingRecipes.length > 0 ? (
              trendingRecipes.map((recipe, index) => (
                <RecipeDisplay
                  key={`trending-${recipe?._id || index}`}
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe)}
                  onLikeChange={handleLikeChange}
                />
              ))
            ) : loading ? (
              <Text style={styles.loadingText}>Loading recipes...</Text>
            ) : (
              <Text style={styles.emptyText}>No recipes found. Create one in the AI Recipe Bot!</Text>
            )}
          </ScrollView>
        </View>

        {/* Saved/Liked Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Recipes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeRow}
          >
            {!loading && savedRecipes.length > 0 ? (
              savedRecipes.map((recipe, index) => (
                <RecipeDisplay
                  key={`saved-${recipe?._id || index}`}
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe)}
                  onLikeChange={handleLikeChange}
                />
              ))
            ) : loading ? (
              <Text style={styles.loadingText}>Loading saved recipes...</Text>
            ) : (
              <Text style={styles.emptyText}>No saved recipes yet. Like recipes to save them!</Text>
            )}
          </ScrollView>
        </View>

        {/* My Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Recipes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeRow}
          >
            {!loading && myRecipes.length > 0 ? (
              myRecipes.map((recipe, index) => (
                <RecipeDisplay
                  key={`my-${recipe?._id || index}`}
                  recipe={recipe}
                  onPress={() => handleRecipePress(recipe)}
                  onLikeChange={handleLikeChange}
                />
              ))
            ) : loading ? (
              <Text style={styles.loadingText}>Loading your recipes...</Text>
            ) : (
              <Text style={styles.emptyText}>No recipes yet. Create one in the AI Recipe Bot!</Text>
            )}
          </ScrollView>
        </View>

        {/* Spacer for chat blurb */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* AI Chat Blurb at Bottom */}
      <Pressable onPress={handleChatPress} style={styles.chatBlurb}>
        <View style={styles.chatIcon}>
          <Ionicons name="chatbubbles" size={20} color="#fff" />
        </View>
        <Text style={styles.chatText}>Chat with AI to create your recipe!</Text>
        <Ionicons name="send" size={20} color={colors.uclaBlue} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#8C8C8C",
    marginLeft: 10,
    marginRight: 10,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#8AB644",
    backgroundColor: "#E8F0DA",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: "Geologica-Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    color: "#100C08",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recipeRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  chatBlurb: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.15)",
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.uclaBlue,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  botBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2430",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    gap: 2,
  },
  botBadgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#fff",
  },
  chatText: {
    flex: 1,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
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
    maxHeight: "80%",
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
    lineHeight: 22,
    color: "#100C08",
  },
  filterSectionTitle: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#100C08",
    marginTop: 16,
    marginBottom: 12,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  filterOptionSelected: {
    backgroundColor: "#84CC16",
    borderColor: "#84CC16",
  },
  filterOptionText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  filterOptionTextSelected: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
  applyButton: {
    backgroundColor: colors.uclaBlue,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  applyButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
  loadingText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#5F6C7B",
    paddingVertical: 40,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#5F6C7B",
    paddingVertical: 40,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
