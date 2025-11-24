import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { API_BASE_URL } from "../../../services/api";

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
  const buildPhotoUri = useMemo(() => {
    const base = API_BASE_URL.replace(/\/$/, "");
    const root = base.endsWith("/api") ? base.slice(0, -4) : base;

    return (photoReference, maxWidth = 600) => {
      if (!photoReference) return null;
      return `${root}/api/photos/${encodeURIComponent(photoReference)}?maxwidth=${maxWidth}`;
    };
  }, []);

  const heroImage = useMemo(() => {
    if (Array.isArray(item?.photos) && item.photos.length > 0) {
      const primary = item.photos[0];
      const inlineUri =
        typeof primary === "object" && typeof primary?.uri === "string"
          ? primary.uri
          : null;
      const inlineUriSafe = inlineUri && inlineUri.includes("key=") ? null : inlineUri;

      const proxyUri =
        typeof primary === "object" && primary?.photo_reference
          ? buildPhotoUri(primary.photo_reference)
          : null;

      const resolved =
        inlineUriSafe && inlineUriSafe.startsWith("http")
          ? inlineUriSafe
          : proxyUri || inlineUriSafe;

      if (resolved) return resolved;
    }

    if (Array.isArray(item?.images) && item.images.length > 0) {
      const fallback = item.images.find((img) => typeof img === "string");
      if (fallback) return fallback;
    }

    return null;
  }, [item, buildPhotoUri]);
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
      <View style={styles.imageContainer}>
        {heroImage ? (
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color="#94A3B8" />
          </View>
        )}
        <View style={styles.imageOverlay}>
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
              color={favorite ? "#FFFFFF" : "#8C8C8C"}
            />
          </Pressable>
          <View style={styles.freePill}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {item?.name || "Unnamed place"}
      </Text>
      
      <View style={styles.metaRow}>
        <Text style={styles.dateText}>
          {item?.date || "Available now"}
        </Text>
        {distanceLabel ? (
          <Text style={styles.distance}>{distanceLabel}</Text>
        ) : null}
      </View>


      <View style={styles.bottomRow}>
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
            <Ionicons name="thumbs-up-outline" size={15} color="#8C8C8C" />
            <Text style={styles.socialText}>13</Text>
          </View>
          <View style={styles.socialItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={15}
              color="#8C8C8C"
            />
            <Text style={styles.socialText}>3</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 0,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
    gap: 0,
  },
  cardSelected: {
    borderColor: colors.uclaGold,
    shadowOpacity: 0.18,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
  },
  heroImage: {
    height: 180,
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#E2E8F0",
  },
  imagePlaceholder: {
    height: 180,
    width: "100%",
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 12,
  },
  favoriteBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteBadgeOn: {
    backgroundColor: "#F65952",
  },
  freePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#8AB644",
  },
  freeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#000000",
    marginTop: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8C8C8C",
    flex: 1,
  },
  distance: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8C8C8C",
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#8AB644",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginLeft: 12,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8C8C8C",
  },
});

export default RestaurantCard;
