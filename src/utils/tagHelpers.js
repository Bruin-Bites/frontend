// Tag categories and their associated tags
const TAG_CATEGORIES = {
  foodType: [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Appetizer",
    "Side Dish",
    "Main Course",
    "Beverage",
  ],
  cuisineType: [
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
  ],
  dietaryRestrictions: [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Halal",
    "Kosher",
    "Nut-Free",
    "Egg-Free",
    "Low-Carbon Footprint",
  ],
  dietaryInformation: [
    "High Protein",
    "Low Carb",
    "Quick & Easy",
    "One Pot",
    "Meal Prep",
    "Budget Friendly",
    "Comfort Food",
  ],
};

// Color schemes for each category
const TAG_COLORS = {
  foodType: {
    background: "#8AB64433",
    text: "#8AB644",
    border: "#8AB644",
  },
  cuisineType: {
    background: "#F8DC7366",
    text: "#E3B300",
    border: "#E3B300",
  },
  dietaryInformation: {
    background: "#AAD8E64D",
    text: "#23BEED",
    border: "#23BEED",
  },
};

/**
 * Determines the category of a tag and returns its color scheme
 * @param {string} tag - The tag name
 * @returns {object} - Object containing background, text, and border colors
 */
export const getTagColors = (tag) => {
  // Check which category the tag belongs to
  for (const [category, tags] of Object.entries(TAG_CATEGORIES)) {
    if (tags.includes(tag)) {
      // Skip dietary restrictions as they don't have colors (they use icons)
      if (category === "dietaryRestrictions") {
        return null;
      }
      return TAG_COLORS[category];
    }
  }

  // Default to foodType colors if tag is not found in any category
  return TAG_COLORS.foodType;
};

/**
 * Gets the category name for a tag
 * @param {string} tag - The tag name
 * @returns {string} - The category name (foodType, cuisineType, dietaryInformation, or dietaryRestrictions)
 */
export const getTagCategory = (tag) => {
  for (const [category, tags] of Object.entries(TAG_CATEGORIES)) {
    if (tags.includes(tag)) {
      return category;
    }
  }
  return "foodType"; // Default category
};

/**
 * Checks if a tag is a dietary restriction (should be displayed with icon)
 * @param {string} tag - The tag name
 * @returns {boolean} - True if tag is a dietary restriction
 */
export const isDietaryRestriction = (tag) => {
  return TAG_CATEGORIES.dietaryRestrictions.includes(tag);
};

// Export TAG_CATEGORIES for use in other components
export { TAG_CATEGORIES };
