import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateRecipe, saveRecipe } from '../services/recipeService';

export default function AIRecipeBotScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text: "Hi! I'm your AI Recipe Bot. Send me what you'd like to cook, and I'll create a custom recipe for you!",
      timestamp: 'Yesterday 10:20 PM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingRecipeId, setSavingRecipeId] = useState(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: 'Just now',
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Call the backend API
      const result = await generateRecipe(inputText, {
        maxPrice: 50,
        limit: 30,
      });

      // Add bot response with recipe
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: `Here's a recipe you can make with eggs and rice — simple, flavorful, and easy to customize.`,
        timestamp: 'Just now',
        recipe: result.reply,
        pricing: result.pricing,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "Sorry, I couldn't generate a recipe. Please try again with a different request.",
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe, pricing) => {
    navigation.navigate('RecipeDetail', { recipe, pricing });
  };

  const handleSaveRecipe = async (recipe, pricing, messageId) => {
    // Check if already saved
    if (savedRecipeIds.has(messageId)) {
      return;
    }

    try {
      setSavingRecipeId(messageId);
      console.log('Saving recipe:', recipe.name);
      await saveRecipe({
        name: recipe.name,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tips: [],
        pricing: {
          ingredients: pricing.ingredients || [],
          totalCost: pricing.totalCost || 0,
          costPerServing: pricing.costPerServing || 0,
        },
        prepTime: '15 minutes',
        difficulty: 2,
        budget: `$${pricing.totalCost?.toFixed(2) || '0'}`,
        tags: [],
        isPublic: false,
        isCooked: false,
        likes: 0,
        comments: 0,
        description: recipe.instructions?.[0] || '',
      });

      // Mark recipe as saved
      setSavedRecipeIds(prev => new Set([...prev, messageId]));
      setSavingRecipeId(null);
      Alert.alert('✓ Saved!', 'Recipe saved to your collection!');

      // Navigate to Budget Recipes screen
      navigation.navigate('Recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      setSavingRecipeId(null);
      Alert.alert('Error', `Failed to save recipe: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>AI Chat Bot</Text>
        <Pressable style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#000" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.type === 'user' && styles.messageRowUser,
            ]}
          >
            {message.type === 'bot' && (
              <View style={styles.botAvatar}>
                <Ionicons name="restaurant" size={20} color="#666" />
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.type === 'user'
                  ? styles.messageBubbleUser
                  : styles.messageBubbleBot,
              ]}
            >
              {message.timestamp && (
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              )}
              <Text style={styles.messageText}>{message.text}</Text>

              {/* Recipe Card if available */}
              {message.recipe && (
                <Pressable
                  style={styles.recipeCard}
                  onPress={() => handleRecipePress(message.recipe, message.pricing)}
                >
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeHeaderLeft}>
                      <Ionicons name="create-outline" size={16} color="#666" />
                      <Text style={styles.recipeLabel}>Recipe</Text>
                    </View>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleSaveRecipe(message.recipe, message.pricing, message.id);
                      }}
                      style={[
                        styles.saveButton,
                        savingRecipeId === message.id && styles.saveButtonLoading,
                        savedRecipeIds.has(message.id) && styles.saveButtonSaved
                      ]}
                      disabled={savingRecipeId === message.id || savedRecipeIds.has(message.id)}
                    >
                      {savingRecipeId === message.id ? (
                        <>
                          <ActivityIndicator size="small" color="#666" />
                          <Text style={styles.saveButtonText}>Saving...</Text>
                        </>
                      ) : savedRecipeIds.has(message.id) ? (
                        <>
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                          <Text style={[styles.saveButtonText, styles.savedButtonText]}>Saved</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="heart-outline" size={20} color="#666" />
                          <Text style={styles.saveButtonText}>Save</Text>
                        </>
                      )}
                    </Pressable>
                  </View>

                  <Text style={styles.recipeName}>{message.recipe.name}</Text>

                  <View style={styles.recipeMetaRow}>
                    <Text style={styles.recipeMeta}>
                      Prep Time: {message.recipe.prepTime || '15 minutes'}
                    </Text>
                  </View>

                  <View style={styles.recipeMetaRow}>
                    <Text style={styles.recipeMeta}>
                      Difficulty: {'★'.repeat(message.recipe.difficulty || 2)}
                      {'☆'.repeat(5 - (message.recipe.difficulty || 2))} (2/5)
                    </Text>
                  </View>

                  {message.pricing && (
                    <View style={styles.recipeMetaRow}>
                      <Text style={styles.recipeMeta}>
                        Budget: ${message.pricing.totalCost?.toFixed(2) || '4-5'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.recipeTags}>
                    {['Asian', 'All Diets', 'High Protein'].map((tag, index) => (
                      <View key={index} style={styles.recipeTag}>
                        <Text style={styles.recipeTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.recipeDescription}>
                    {message.recipe.description ||
                      'Chat with AI to create or discuss this recipe.'}
                  </Text>

                  <View style={styles.ingredientsPreview}>
                    <Text style={styles.ingredientsTitle}>
                      • {message.recipe.ingredients?.length || 5} ingredients
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.messageRow}>
            <View style={styles.botAvatar}>
              <Ionicons name="restaurant" size={20} color="#666" />
            </View>
            <View style={styles.messageBubbleBot}>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.loadingText}>Generating recipe...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Find recipe"
          placeholderTextColor="#999"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() && !loading ? '#007AFF' : '#ccc'}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  searchButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleBot: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 4,
  },
  messageBubbleUser: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recipeCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 12,
    color: '#666',
  },
  saveButtonLoading: {
    opacity: 0.6,
  },
  saveButtonSaved: {
    backgroundColor: '#E8F5E9',
  },
  savedButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  recipeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  recipeMetaRow: {
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 13,
    color: '#666',
  },
  recipeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  recipeTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  recipeTagText: {
    fontSize: 11,
    color: '#666',
  },
  recipeDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  ingredientsPreview: {
    marginTop: 4,
  },
  ingredientsTitle: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    fontSize: 15,
    color: '#000',
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
});
