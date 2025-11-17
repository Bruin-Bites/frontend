import api from './api';

// Generate recipe using RAG (Retrieval-Augmented Generation)
export const generateRecipe = async (query, options = {}) => {
  try {
    const response = await api.post('/rag-recipes', {
      query,
      maxPrice: options.maxPrice || 50,
      onSaleOnly: options.onSaleOnly || false,
      categories: options.categories || [],
      limit: options.limit || 30,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating recipe:', error);
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
export const saveRecipe = async (recipeData, userId = 'default-user') => {
  try {
    const response = await api.post('/recipes', {
      ...recipeData,
      userId,
    });
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
};
