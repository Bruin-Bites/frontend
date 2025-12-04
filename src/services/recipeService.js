import api from './api';

// Generate recipe using RAG (Retrieval-Augmented Generation)
// Now supports two-phase loading: returns recipe immediately and fetches pricing separately
export const generateRecipe = async (query, options = {}) => {
  try {
    // Phase 1: Get recipe without pricing
    const response = await api.post('/rag-recipes', {
      query,
      maxPrice: options.maxPrice || 50,
      onSaleOnly: options.onSaleOnly || false,
      categories: options.categories || [],
      limit: options.limit || 30,
    });

    const result = response.data;

    // If pricing is pending, fetch it separately
    if (result.pricingPending && options.onPricingUpdate) {
      // Immediately return the recipe data
      const initialResult = {
        ...result,
        pricing: null, // No pricing yet
        pricingLoading: true,
      };

      // Fetch pricing in the background
      fetchRecipePricing(
        result.reply.ingredients,
        result.reply.servings,
        query,
        options
      ).then(pricingData => {
        // Call the callback with pricing data when ready
        if (options.onPricingUpdate) {
          options.onPricingUpdate(pricingData);
        }
      }).catch(error => {
        console.error('Error fetching pricing:', error);
        // Still call the callback with error state
        if (options.onPricingUpdate) {
          options.onPricingUpdate({ error: true, totalCost: 0 });
        }
      });

      return initialResult;
    }

    return result;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};

// Helper function to fetch pricing separately
const fetchRecipePricing = async (ingredients, servings, query, options = {}) => {
  try {
    const response = await api.post('/rag-recipes/pricing', {
      ingredients,
      servings,
      query,
      maxPrice: options.maxPrice || 50,
      onSaleOnly: options.onSaleOnly || false,
      categories: options.categories || [],
      limit: options.limit || 30,
    });
    return response.data.pricing;
  } catch (error) {
    console.error('Error fetching pricing:', error);
    throw error;
  }
};

// Search for products (testing endpoint)
export const searchProducts = async (query, limit = 10) => {
  try {
    const response = await api.post('/rag-recipes/search', {
      query,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get community posts
export const getCommunityPosts = async () => {
  try {
    const response = await api.get('/community');
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
};

// Create community post
export const createCommunityPost = async (text, tag, author = 'Anonymous Bruin') => {
  try {
    const response = await api.post('/community', {
      text,
      tag,
      author,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
};

// Save a recipe to user's collection
export const saveRecipe = async (recipeData) => {
  try {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

// Get all user's saved recipes
export const getSavedRecipes = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic);
    if (filters.isCooked !== undefined) params.append('isCooked', filters.isCooked);

    const response = await api.get(`/recipes?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    throw error;
  }
};

// Get a specific recipe by ID
export const getRecipeById = async (recipeId) => {
  try {
    const response = await api.get(`/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

// Update a recipe
export const updateRecipe = async (recipeId, updates) => {
  try {
    const response = await api.patch(`/recipes/${recipeId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Delete a recipe
export const deleteRecipe = async (recipeId) => {
  try {
    const response = await api.delete(`/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Like/Save a recipe
export const likeRecipe = async (recipeId) => {
  try {
    const response = await api.post(`/auth/me/recipes/${recipeId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking recipe:', error);
    throw error;
  }
};

// Unlike/Remove a saved recipe
export const unlikeRecipe = async (recipeId) => {
  try {
    const response = await api.delete(`/auth/me/recipes/${recipeId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error unliking recipe:', error);
    throw error;
  }
};

// Get user's saved/liked recipes
export const getUserSavedRecipes = async () => {
  try {
    const response = await api.get('/auth/me/recipes/saved');
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      // Treat missing endpoint/user as no saved recipes instead of failing hard
      return { recipes: [], count: 0 };
    }

    console.warn('Error fetching saved recipes:', error?.message || error);
    throw error;
  }
};

// Mark a recipe as cooked/uncooked
export const markRecipeAsCooked = async (recipeId, isCooked) => {
  try {
    const response = await api.patch(`/auth/me/recipes/${recipeId}/cook`, { isCooked });
    return response.data;
  } catch (error) {
    console.error('Error updating cooked status:', error);
    throw error;
  }
};

// Update checked ingredients for a recipe
export const updateCheckedIngredients = async (recipeId, checkedIngredients) => {
  try {
    const response = await api.patch(`/auth/me/recipes/${recipeId}/ingredients`, { checkedIngredients });
    return response.data;
  } catch (error) {
    console.error('Error updating checked ingredients:', error);
    throw error;
  }
};

// Update personal note for a saved recipe
export const updatePersonalNote = async (recipeId, personalNote) => {
  try {
    const response = await api.patch(`/auth/me/recipes/${recipeId}/note`, { personalNote });
    return response.data;
  } catch (error) {
    console.error('Error updating personal note:', error);
    throw error;
  }
};

export default {
  generateRecipe,
  searchProducts,
  getCommunityPosts,
  createCommunityPost,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getUserSavedRecipes,
  markRecipeAsCooked,
  updateCheckedIngredients,
  updatePersonalNote,
};
