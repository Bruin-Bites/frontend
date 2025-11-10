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

export default {
  generateRecipe,
  searchProducts,
  getCommunityPosts,
  createCommunityPost,
};
