import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { getTagColors, isDietaryRestriction } from "../utils/tagHelpers";

export default function RecipeDisplay({ recipe, onPress }) {
  const [liked, setLiked] = useState(recipe.isLiked || false);

  const renderStars = (difficulty) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={i <= difficulty ? styles.starFilled : styles.starEmpty}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || "https://via.placeholder.com/200" }}
          style={styles.image}
        />

        {/* Like Button - Top Left */}
        <Pressable
          onPress={() => setLiked(!liked)}
          style={styles.likeButton}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color="#EF4444"
          />
        </Pressable>

        {/* Cooked/Uncooked Badge - Top Right */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {recipe.isCooked ? "Cooked" : "Uncooked"}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        {/* Recipe Name */}
        <Text style={styles.recipeName} numberOfLines={2}>
          {recipe.name}
        </Text>

        {/* Prep Time */}
        <Text style={styles.prepTime}>Prep time: {recipe.prepTime} minutes</Text>

        {/* Difficulty */}
        <View style={styles.difficultyRow}>
          <Text style={styles.difficultyLabel}>Difficulty:</Text>
          <View style={styles.starsContainer}>
            {renderStars(recipe.difficulty)}
          </View>
        </View>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {recipe.tags.slice(0, 3).map((tag, index) => {
              // Get colors - dietary restrictions use dietary information colors (blue)
              let colors = getTagColors(tag);
              if (isDietaryRestriction(tag)) {
                colors = {
                  background: "#AAD8E64D",
                  text: "#23BEED",
                  border: "#23BEED",
                };
              }
              if (!colors) return null;

              return (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Stats Row - Likes and Comments */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={14} color="#5F6C7B" />
            <Text style={styles.statText}>{recipe.likeCount || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={14} color="#5F6C7B" />
            <Text style={styles.statText}>{recipe.commentCount || 0}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  likeButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#fff",
    borderRadius: 12,
    borderColor: "#fff",
  },
  infoContainer: {
    padding: 12,
  },
  recipeName: {
    fontFamily: "Geologica-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#100C08",
    marginBottom: 6,
  },
  prepTime: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
    marginBottom: 4,
  },
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  difficultyLabel: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
    marginRight: 6,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starFilled: {
    fontSize: 14,
    color: "#255633",
    marginRight: 2,
  },
  starEmpty: {
    fontSize: 14,
    color: "#D1D5DB",
    marginRight: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontFamily: "HankenGrotesk-Light",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 16,
    color: "#100C08",
  },
});
