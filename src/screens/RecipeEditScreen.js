import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Input from '../components/Input';
import Button from '../components/Button';

export default function RecipeEditScreen({ route, navigation }) {
  const { recipe: initialRecipe, pricing: initialPricing } = route.params;

  const [recipeName, setRecipeName] = useState(initialRecipe.name);
  const [servings, setServings] = useState(initialRecipe.servings.toString());
  const [ingredients, setIngredients] = useState(
    initialRecipe.ingredients?.map((ing) => ({
      amount: ing.amount || '',
      item: ing.item || '',
    })) || [{ amount: '', item: '' }]
  );
  const [instructions, setInstructions] = useState(
    initialRecipe.instructions || ['']
  );

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: '', item: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSave = () => {
    // Validate
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return;
    }

    if (!servings || parseInt(servings) < 1) {
      Alert.alert('Error', 'Please enter a valid number of servings');
      return;
    }

    const hasValidIngredient = ingredients.some(
      (ing) => ing.amount.trim() && ing.item.trim()
    );
    if (!hasValidIngredient) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    const hasValidInstruction = instructions.some((inst) => inst.trim());
    if (!hasValidInstruction) {
      Alert.alert('Error', 'Please add at least one instruction');
      return;
    }

    // Create updated recipe
    const updatedRecipe = {
      name: recipeName,
      servings: parseInt(servings),
      ingredients: ingredients.filter((ing) => ing.amount.trim() && ing.item.trim()),
      instructions: instructions.filter((inst) => inst.trim()),
    };

    // TODO: Save to backend or local storage
    Alert.alert('Success', 'Recipe updated successfully!', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('RecipeDetail', {
            recipe: updatedRecipe,
            pricing: initialPricing,
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Input
            label="Recipe Name"
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Enter recipe name"
          />
          <Input
            label="Servings"
            value={servings}
            onChangeText={setServings}
            placeholder="Number of servings"
            keyboardType="number-pad"
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <Ionicons name="add-circle" size={24} color={colors.uclaBlue} />
            </TouchableOpacity>
          </View>

          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.ingredientInputs}>
                <Input
                  value={ingredient.amount}
                  onChangeText={(value) =>
                    handleIngredientChange(index, 'amount', value)
                  }
                  placeholder="Amount"
                  style={styles.amountInput}
                />
                <Input
                  value={ingredient.item}
                  onChangeText={(value) =>
                    handleIngredientChange(index, 'item', value)
                  }
                  placeholder="Ingredient"
                  style={styles.itemInput}
                />
              </View>
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemoveIngredient(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddInstruction}
            >
              <Ionicons name="add-circle" size={24} color={colors.uclaBlue} />
            </TouchableOpacity>
          </View>

          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.instructionInputContainer}>
                <Input
                  value={instruction}
                  onChangeText={(value) => handleInstructionChange(index, value)}
                  placeholder={`Step ${index + 1}`}
                  multiline
                  numberOfLines={3}
                  style={styles.instructionInput}
                />
              </View>
              {instructions.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemoveInstruction(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Button title="Save Changes" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.uclaBlue,
  },
  addButton: {
    padding: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  itemInput: {
    flex: 2,
    marginBottom: 0,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: 8,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.uclaBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  instructionInputContainer: {
    flex: 1,
    marginLeft: 8,
  },
  instructionInput: {
    marginBottom: 0,
  },
  saveButton: {
    marginTop: 8,
  },
});
