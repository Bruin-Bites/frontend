import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import editIcon from "../../assets/edit.png";

export default function RecipeCard({ recipe, tips, totalCost, onEdit }) {
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

  return (
    <View style={styles.container}>
      {/* Recipe Header with Edit and Expand Icons */}
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeHeaderText}>Recipe</Text>
        <View style={styles.headerIcons}>
          <Pressable style={styles.iconButton} onPress={onEdit}>
            <Image source={editIcon} style={styles.editIcon} />
          </Pressable>
          <Pressable onPress={() => setExpanded(!expanded)} style={styles.iconButton}>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#5F6C7B"
            />
          </Pressable>
        </View>
      </View>

      {expanded && (
        <View style={styles.content}>
          {/* Recipe Image */}
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Images</Text>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={32} color="#9CA3AF" />
              <Text style={styles.imagePlaceholderText}>Add your own image</Text>
            </View>
          </View>

          {/* Recipe Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Name:</Text>
            <Text style={styles.recipeName}>{recipe.name}</Text>
          </View>

          {/* Short Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Short Description:</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          {/* Meta Info */}
          <View style={styles.metaSection}>
            <Text style={styles.metaText}>Prep Time: {recipe.prepTime}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Difficulty: </Text>
              <View style={styles.starsContainer}>
                {renderStars(recipe.difficulty)}
                <Text style={styles.metaText}> ({recipe.difficulty}/5)</Text>
              </View>
            </View>
            <Text style={styles.metaText}>Budget: ${((totalCost ?? 0) * 1.5 + 2).toFixed(0)}</Text>
          </View>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags:</Text>
              <Text style={styles.tagsText}>{recipe.tags.join(", ")}</Text>
            </View>
          )}

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  {ingredient.amount} {ingredient.item}
                  {/* {ingredient.pricing?.found && (
                    <Text style={styles.priceHint}>
                      {" "}(preferably {ingredient.pricing.productName})
                    </Text>
                  )} */}
                </Text>
              </View>
            ))}
          </View>

          {/* Suggested Places to Buy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Places to Buy:</Text>
            <Text style={styles.bodyText}>All ingredients → Trader Joe's</Text>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions:</Text>
            {recipe.instructions && recipe.instructions.map((step, index) => (
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
              <Text style={styles.allergyText}>{recipe.allergies.join(", ")}</Text>
            </View>
          )}

          {/* Tips or Substitutions */}
          {tips && tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips or Substitutions:</Text>
              {tips.map((tip, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Footer with Like and Save */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Like This Recipe?</Text>
            <Pressable style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",

    overflow: "hidden",
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  recipeHeaderText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#255633",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  content: {
    padding: 16,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageSectionTitle: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#255633",
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  imagePlaceholderText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#255633",
    marginBottom: 6,
  },
  recipeName: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#255633",
  },
  description: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  metaSection: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 14,
    color: "#255633",
    marginRight: 1,
  },
  tagsText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 14,
    color: "#1B2430",
    marginRight: 8,
    lineHeight: 20,
  },
  listText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    flex: 1,
  },
  priceHint: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
    fontStyle: "italic",
  },
  bodyText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  instructionRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingLeft: 4,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B2430",
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    flex: 1,
  },
  allergyText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  footer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "flex-start",
  },
  footerText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#fff",
  },
});
