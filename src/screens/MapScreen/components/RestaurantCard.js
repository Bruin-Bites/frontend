import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const IGNORED_TYPES = new Set([
  "establishment",
  "food",
  "point_of_interest",
  "restaurant",
]);

const formatTag = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const RestaurantCard = ({
  item,
  selected,
  favorite = false,
  onPress,
  onToggleFavorite,
}) => {
  const distanceLabel =
    item?.userDistanceText?.trim() ||
    item?.distance_text ||
    item?.distance?.text ||
    "";

  const displayTags = useMemo(() => {
    if (!Array.isArray(item?.types)) {
      return [];
    }

    const formatted = item.types
      .filter((type) => type && !IGNORED_TYPES.has(type))
      .map(formatTag)
      .filter(Boolean);

    if (formatted.length > 0) {
      return formatted.slice(0, 3);
    }

    const fallback = formatTag(item.types[0]);
    return fallback ? [fallback] : [];
  }, [item]);

  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite?.();
          }}
          style={[
            styles.favoriteBadge,
            favorite && styles.favoriteBadgeOn,
          ]}
          hitSlop={10}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={16}
            color={favorite ? "#FFFFFF" : "#D92D20"}
          />
        </Pressable>
        <View style={styles.freePill}>
          <Text style={styles.freeText}>FREE</Text>
        </View>
      </View>

      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={28} color="#94A3B8" />
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={1}>
          {item?.name || "Unnamed place"}
        </Text>
        {distanceLabel ? (
          <Text style={styles.distance}>{distanceLabel}</Text>
        ) : null}
      </View>

      {displayTags.length > 0 && (
        <View style={styles.tagsRow}>
          {displayTags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.socialRow}>
        <View style={styles.socialItem}>
          <Ionicons name="thumbs-up-outline" size={15} color="#475467" />
          <Text style={styles.socialText}>13</Text>
        </View>
        <View style={styles.socialItem}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={15}
            color="#475467"
          />
          <Text style={styles.socialText}>3</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 14,
  },
  cardSelected: {
    borderColor: colors.uclaGold,
    shadowOpacity: 0.18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(217,45,32,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteBadgeOn: {
    backgroundColor: "#D92D20",
  },
  freePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F2F4F7",
  },
  freeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#1D2939",
  },
  imagePlaceholder: {
    height: 110,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
  },
  distance: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475467",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.uclaBlue,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475467",
  },
});

export default RestaurantCard;
