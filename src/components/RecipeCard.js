import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function RecipeCard({ recipe, onPress, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{recipe.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
            {recipe.pricing && (
              <>
                <Text style={styles.dot}>•</Text>
                <Ionicons name="cash-outline" size={14} color={colors.uclaGold} />
                <Text style={styles.priceText}>
                  ${recipe.pricing.totalCost?.toFixed(2) || '0.00'}
                </Text>
              </>
            )}
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>

      {recipe.pricing && (
        <View style={styles.costPerServing}>
          <Text style={styles.costLabel}>Per serving: </Text>
          <Text style={styles.costValue}>
            ${recipe.pricing.costPerServing?.toFixed(2) || '0.00'}
          </Text>
        </View>
      )}

      {recipe.ingredients && (
        <View style={styles.ingredientPreview}>
          <Text style={styles.ingredientLabel}>Ingredients:</Text>
          <Text style={styles.ingredientText} numberOfLines={2}>
            {recipe.ingredients.slice(0, 3).map(ing => ing.item).join(', ')}
            {recipe.ingredients.length > 3 && '...'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.uclaBlue,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  dot: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 4,
  },
  priceText: {
    fontSize: 13,
    color: colors.uclaGold,
    fontWeight: '600',
  },
  costPerServing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.uclaGold,
  },
  ingredientPreview: {
    marginTop: 8,
  },
  ingredientLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
