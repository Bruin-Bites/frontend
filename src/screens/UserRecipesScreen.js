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

// Placeholder recipe data
const PLACEHOLDER_RECIPES = [
  {
    id: 1,
    name: "Creamy Mushroom Pasta",
    image: "https://via.placeholder.com/200",
    prepTime: 30,
    difficulty: 2,
    servings: 4,
    rating: 4.5,
    createdBy: "bruineats",
    budget: 12,
    tags: ["Italian", "Dinner", "Vegetarian", "Comfort Food"],
    isCooked: false,
    isLiked: true,
    isPrivate: false,
    likeCount: 25,
    commentCount: 8,
    description: "A rich and creamy pasta dish with sautéed mushrooms, garlic, and fresh herbs in a velvety parmesan sauce.",
    ingredients: [
      { name: "pasta", amount: "1 box", checked: false },
      { name: "mushrooms", amount: "2 cups", checked: false },
      { name: "heavy cream", amount: "1 cup", checked: false },
      { name: "garlic", amount: "3 cloves", checked: false },
      { name: "parmesan cheese", amount: "1/2 cup", checked: false },
      { name: "olive oil", amount: "2 tbsp", checked: false },
      { name: "fresh thyme", amount: "1 tsp", checked: false },
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook pasta according to package directions.",
      "While pasta cooks, heat olive oil in a large skillet over medium-high heat.",
      "Add sliced mushrooms and cook until golden brown, about 5-7 minutes.",
      "Add minced garlic and thyme, cook for 1 minute until fragrant.",
      "Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened.",
      "Stir in parmesan cheese until melted and smooth.",
      "Drain pasta and add to the sauce. Toss to coat evenly.",
      "Season with salt and pepper. Serve hot with extra parmesan.",
    ],
    allergies: ["gluten", "dairy", "vegetarian"],
    tips: [
      "Use a mix of mushrooms like cremini, shiitake, and oyster for more depth.",
      "Add a splash of pasta water to the sauce if it gets too thick.",
      "Garnish with fresh parsley for extra color.",
    ],
    personalNote: "",
    location: { name: "99 Ranch Market", address: "1300 N Vermont Ave, Los Angeles, CA 90027", distance: "1.2 mi", ingredients: "All Ingredients" },
    comments: [
      {
        id: 1,
        author: "TofulLover22",
        time: "45 min",
        text: "Just made this for dinner tonight, and it turned out amazing! I added a bit of lemon zest and it really elevated the sauce.",
        likes: 3,
        replies: 2,
      },
      {
        id: 2,
        author: "michael.kev03",
        time: "3 hr",
        text: "Made this in my dorm with frozen veggies and it was a hit! Saving this to make it again for lunch the next day!",
        likes: 5,
        replies: 0,
      },
    ],
  },
  {
    id: 2,
    name: "Avocado Egg Toast with Chili Flakes",
    image: "https://via.placeholder.com/200",
    prepTime: 10,
    difficulty: 1,
    servings: 2,
    rating: 4.8,
    createdBy: "ucla_foodie",
    budget: 8,
    tags: ["American", "Breakfast", "Vegetarian", "Quick & Easy"],
    isCooked: false,
    isLiked: false,
    isPrivate: true,
    likeCount: 44,
    commentCount: 13,
    description: "A simple yet delicious breakfast toast topped with creamy avocado, perfectly cooked eggs, and a kick of chili flakes.",
    ingredients: [
      { name: "bread slices", amount: "2", checked: false },
      { name: "avocado", amount: "1 ripe", checked: false },
      { name: "eggs", amount: "2", checked: false },
      { name: "chili flakes", amount: "1/2 tsp", checked: false },
      { name: "lime juice", amount: "1 tsp", checked: false },
      { name: "salt and pepper", amount: "to taste", checked: false },
      { name: "olive oil", amount: "1 tbsp", checked: false },
    ],
    instructions: [
      "Toast the bread slices until golden and crispy.",
      "Mash the avocado with lime juice, salt, and pepper.",
      "Heat olive oil in a pan and fry eggs to your liking (sunny side up recommended).",
      "Spread mashed avocado on toasted bread.",
      "Top with fried egg and sprinkle with chili flakes.",
      "Serve immediately while warm.",
    ],
    allergies: ["gluten", "eggs", "vegetarian"],
    tips: [
      "Use sourdough bread for extra flavor.",
      "Add everything bagel seasoning for extra crunch.",
      "Drizzle with hot sauce if you like it spicy.",
    ],
    personalNote: "",
    location: { name: "Trader Joe's", address: "1000 Glendon Ave, Los Angeles, CA 90024", distance: "0.8 mi", ingredients: "All Ingredients" },
    comments: [
      {
        id: 1,
        author: "breakfast_lover",
        time: "2 hr",
        text: "Perfect quick breakfast! I added some cherry tomatoes on the side.",
        likes: 8,
        replies: 1,
      },
    ],
  },
  {
    id: 3,
    name: "Spicy Garlic Tofu Stir-Fry",
    image: "https://via.placeholder.com/200",
    prepTime: 20,
    difficulty: 3,
    servings: 4,
    rating: 4.7,
    createdBy: "miyayeeekg",
    budget: 15,
    tags: ["Asian", "Dinner", "Vegan", "High Protein", "Quick & Easy"],
    isCooked: false,
    isLiked: false,
    isPrivate: false,
    likeCount: 32,
    commentCount: 5,
    description: "A quick plant-based stir-fry featuring crispy tofu, garlic, and a spicy soy glaze, perfect for busy weeknights.",
    ingredients: [
      {
        title: "For the Tofu Marinade:",
        items: [
          { name: "extra firm tofu", amount: "1 block", checked: false },
          { name: "soy sauce", amount: "2 tbsp", checked: false },
          { name: "sesame oil", amount: "1 tbsp", checked: false },
          { name: "cornstarch", amount: "1 tbsp", checked: false },
        ],
      },
      {
        title: "For the Stir-Fry Sauce:",
        items: [
          { name: "soy sauce", amount: "1 tbsp", checked: false },
          { name: "chili paste", amount: "1 tbsp", checked: false },
          { name: "garlic (minced)", amount: "4 cloves", checked: false },
          { name: "ginger (minced)", amount: "1 tsp", checked: false },
          { name: "rice vinegar", amount: "1 tbsp", checked: false },
        ],
      },
      {
        title: "For the Vegetables:",
        items: [
          { name: "bell peppers", amount: "2", checked: false },
          { name: "broccoli florets", amount: "1 cup", checked: false },
          { name: "green onions", amount: "3", checked: false },
          { name: "snap peas", amount: "1/2 cup", checked: false },
        ],
      },
    ],
    instructions: [
      "Drain and press tofu for 10 minutes, then cut into cubes.",
      "Heat sesame oil in a large pan or wok over high heat.",
      "Add tofu and cook until golden and crispy on all sides, about 8-10 minutes.",
      "Remove tofu and set aside.",
      "In the same pan, add garlic, chili paste, bell peppers, and broccoli.",
      "Stir-fry for 3-4 minutes until vegetables are tender-crisp.",
      "Add tofu back in and toss everything in the sauce.",
      "Garnish with green onions and serve hot with rice or noodles.",
    ],
    allergies: ["soybeans", "vegan", "low-carbon"],
    tips: [
      "Swap tofu for tempeh or chicken if not vegetarian.",
      "Add cashews for extra crunch.",
      "Use a mix of colorful bell peppers for visual appeal.",
    ],
    personalNote: "",
    location: { name: "99 Ranch Market", address: "1300 N Vermont Ave, Los Angeles, CA 90027", distance: "1.2 mi", ingredients: "All Ingredients" },
    comments: [
      {
        id: 1,
        author: "miyayeeekg",
        time: "1 d",
        text: "Holy moly!! I can't stop keeping the tofu crispy without it getting soggy after I put in it days crispp.",
        likes: 12,
        replies: 3,
      },
      {
        id: 2,
        author: "ikapono",
        time: "2 d",
        text: "Paired this with soba noodles instead of rice and added mushrooms. Seriously restaurant-quality!",
        likes: 7,
        replies: 1,
      },
    ],
  },
];

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
    navigation.navigate("Recipes");
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
            {PLACEHOLDER_RECIPES.map((recipe) => (
              <RecipeDisplay
                key={`trending-${recipe.id}`}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Most Liked Recipe Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Liked Recipe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeRow}
          >
            {PLACEHOLDER_RECIPES.map((recipe) => (
              <RecipeDisplay
                key={`liked-${recipe.id}`}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Most Recent Recipe Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Recent Recipe</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeRow}
          >
            {PLACEHOLDER_RECIPES.map((recipe) => (
              <RecipeDisplay
                key={`recent-${recipe.id}`}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe)}
              />
            ))}
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
    borderColor : "#8AB644",
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
});
