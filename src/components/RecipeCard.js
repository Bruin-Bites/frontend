import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import IngredientItem from "./IngredientItem";

export default function RecipeCard({ recipe, tips, totalCost, costPerServing }) {
  const [expanded, setExpanded] = useState(true);

  const renderStars = (difficulty) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= difficulty ? "★" : "☆"}
        </Text>
      );
    }
    return stars;
  };

  const renderBudget = (cost) => {
    const dollarSigns = [];
    const level = cost <= 3 ? 1 : cost <= 6 ? 2 : cost <= 10 ? 3 : cost <= 15 ? 4 : 5;
    for (let i = 1; i <= 5; i++) {
      dollarSigns.push(
        <Text key={i} style={i <= level ? styles.dollarActive : styles.dollarInactive}>
          $
        </Text>
      );
    }
    return dollarSigns;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Ionicons
            name={expanded ? "chevron-up-circle" : "chevron-down-circle"}
            size={24}
            color={colors.uclaBlue}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {/* Description */}
          <Text style={styles.description}>{recipe.description}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Prep Time:</Text>
              <Text style={styles.metaValue}>{recipe.prepTime} minutes</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Difficulty:</Text>
              <View style={styles.starsContainer}>
                {renderStars(recipe.difficulty)}
                <Text style={styles.difficultyText}> ({recipe.difficulty}/5)</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Budget:</Text>
              <View style={styles.budgetContainer}>
                {renderBudget(totalCost)}
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Servings:</Text>
              <Text style={styles.metaValue}>{recipe.servings}</Text>
            </View>
          </View>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.sectionLabel}>Tags:</Text>
              <View style={styles.tagsRow}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cost Summary */}
          <View style={styles.costSummary}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Total Cost:</Text>
              <Text style={styles.costValue}>${totalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Cost Per Serving:</Text>
              <Text style={styles.costValue}>${costPerServing.toFixed(2)}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <IngredientItem key={index} ingredient={ingredient} />
            ))}
          </View>

          {/* Suggested Places to Buy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Places to Buy:</Text>
            <Text style={styles.storeText}>All ingredients → Trader Joe's, Ralph's</Text>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions:</Text>
            {recipe.instructions.map((step, index) => (
              <View key={index} style={styles.instructionRow}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Allergies */}
          {recipe.allergies && recipe.allergies.length > 0 && recipe.allergies[0] !== "None" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergies:</Text>
              <Text style={styles.allergyText}>
                {recipe.allergies.join(", ")}
              </Text>
            </View>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips or Substitutions:</Text>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Save Button */}
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B2430",
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#5F6C7B",
    marginBottom: 16,
    lineHeight: 20,
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2430",
    width: 90,
  },
  metaValue: {
    fontSize: 13,
    color: "#5F6C7B",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 14,
    color: "#FFB800",
    marginRight: 2,
  },
  difficultyText: {
    fontSize: 12,
    color: "#5F6C7B",
  },
  budgetContainer: {
    flexDirection: "row",
  },
  dollarActive: {
    fontSize: 14,
    color: "#22C55E",
    fontWeight: "600",
  },
  dollarInactive: {
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  tagsContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2430",
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#F1F5FA",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.15)",
  },
  tagText: {
    fontSize: 11,
    color: colors.uclaBlue,
    fontWeight: "600",
  },
  costSummary: {
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.15)",
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  costLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2430",
  },
  costValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.uclaBlue,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B2430",
    marginBottom: 10,
  },
  storeText: {
    fontSize: 13,
    color: "#5F6C7B",
  },
  instructionRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.uclaBlue,
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 14,
    color: "#1B2430",
    flex: 1,
    lineHeight: 20,
  },
  allergyText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "600",
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: "#1B2430",
    marginRight: 6,
  },
  tipText: {
    fontSize: 13,
    color: "#5F6C7B",
    flex: 1,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: colors.uclaBlue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
